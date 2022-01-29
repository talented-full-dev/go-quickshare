package server

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/ihexxa/gocfg"

	"github.com/ihexxa/quickshare/src/db/sitestore"
	"github.com/ihexxa/quickshare/src/kvstore/boltdbpvd"
)

type Opts struct {
	Host    string   `short:"h" long:"host" description:"server hostname"`
	Port    int      `short:"p" long:"port" description:"server port"`
	DbPath  string   `short:"d" long:"db" description:"path of the quickshare.db"`
	Configs []string `short:"c" long:"configs" description:"config path"`
}

func LoadCfg(opts *Opts) (*gocfg.Cfg, error) {
	defaultCfg, err := DefaultConfig()
	if err != nil {
		return nil, err
	}

	cfg, err := gocfg.New(NewConfig()).Load(gocfg.JSONStr(defaultCfg))
	if err != nil {
		return nil, err
	}

	if opts.DbPath != "" {
		cfg, err = mergeDbConfig(cfg, opts.DbPath)
		if err != nil {
			return nil, err
		}
	} else {
		_, err := os.Stat(boltdbpvd.DBName)
		if err == nil {
			cfg, err = mergeDbConfig(cfg, boltdbpvd.DBName)
		} else if err != nil {
			if !os.IsNotExist(err) {
				return nil, err
			}
		}
	}

	cfg, err = mergeConfigFiles(cfg, opts.Configs)
	if err != nil {
		return nil, err
	}

	return mergeArgs(cfg, opts)
}

func mergeDbConfig(cfg *gocfg.Cfg, dbPath string) (*gocfg.Cfg, error) {
	kv := boltdbpvd.New(dbPath, 1024)
	defer kv.Close()

	siteStore, err := sitestore.NewSiteStore(kv)
	if err != nil {
		return nil, fmt.Errorf("fail to new site config store: %s", err)
	}

	clientCfg, err := siteStore.GetCfg()
	if err != nil {
		return nil, err
	}
	clientCfgBytes, err := json.Marshal(clientCfg)
	if err != nil {
		return nil, err
	}

	cfgStr := fmt.Sprintf(`{"site": %s}`, string(clientCfgBytes))
	return cfg.Load(gocfg.JSONStr(cfgStr))
}

func mergeConfigFiles(cfg *gocfg.Cfg, configPaths []string) (*gocfg.Cfg, error) {
	var err error

	for _, configPath := range configPaths {
		if strings.HasSuffix(configPath, ".yml") || strings.HasSuffix(configPath, ".yaml") {
			cfg, err = cfg.Load(gocfg.YAML(configPath))
		} else if strings.HasSuffix(configPath, ".json") {
			cfg, err = cfg.Load(gocfg.JSON(configPath))
		} else {
			return nil, fmt.Errorf("unknown config file type (.yml .yaml .json are supported): %s", configPath)
		}
		if err != nil {
			return nil, err
		}
	}

	return cfg, nil
}

func mergeArgs(cfg *gocfg.Cfg, opts *Opts) (*gocfg.Cfg, error) {
	if opts.Host != "" {
		cfg.SetString("Server.Host", opts.Host)
	}
	if opts.Port != 0 {
		cfg.SetInt("Server.Port", opts.Port)
	}

	return cfg, nil
}