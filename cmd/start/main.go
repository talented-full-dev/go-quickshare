package main

import (
	"fmt"
	"os"

	goflags "github.com/jessevdk/go-flags"

	serverPkg "github.com/ihexxa/quickshare/src/server"
)

var opts = &serverPkg.Opts{}

func main() {
	_, err := goflags.Parse(opts)
	if err != nil {
		panic(err)
	}

	cfg, err := serverPkg.LoadCfg(opts)
	if err != nil {
		fmt.Printf("failed to load config: %s", err)
		os.Exit(1)
	}

	srv, err := serverPkg.NewServer(cfg)
	if err != nil {
		fmt.Printf("failed to new server: %s", err)
		os.Exit(1)
	}

	err = srv.Start()
	if err != nil {
		fmt.Printf("failed to start server: %s", err)
		os.Exit(1)
	}
}
