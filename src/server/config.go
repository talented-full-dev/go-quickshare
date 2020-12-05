package server

type FSConfig struct {
	Root       string `json:"root"`
	OpensLimit int    `json:"opensLimit"`
	OpenTTL    int    `json:"openTTL"`
}

type UsersCfg struct {
	EnableAuth     bool `json:"enableAuth"`
	CookieTTL      int  `json:"cookieTTL"`
	CookieSecure   bool `json:"cookieSecure"`
	CookieHttpOnly bool `json:"cookieHttpOnly"`
}

type Secrets struct {
	TokenSecret string `json:"tokenSecret" cfg:"env"`
}

type ServerCfg struct {
	Debug          bool   `json:"debug"`
	Host           string `json:"host"`
	Port           int    `json:"port"`
	ReadTimeout    int    `json:"readTimeout"`
	WriteTimeout   int    `json:"writeTimeout"`
	MaxHeaderBytes int    `json:"maxHeaderBytes"`
}

type Config struct {
	Fs      *FSConfig  `json:"fs"`
	Secrets *Secrets   `json:"secrets"`
	Server  *ServerCfg `json:"server"`
	Users   *UsersCfg  `json:"users"`
}

func NewEmptyConfig() *Config {
	return &Config{}
}

func NewDefaultConfig() *Config {
	return &Config{
		Fs: &FSConfig{
			Root:       ".",
			OpensLimit: 128,
			OpenTTL:    60, // 1 min
		},
		Users: &UsersCfg{
			EnableAuth:     true,
			CookieTTL:      3600 * 24 * 7, // 1 week
			CookieSecure:   false,
			CookieHttpOnly: true,
		},
		Secrets: &Secrets{
			TokenSecret: "",
		},
		Server: &ServerCfg{
			Debug:          false,
			Host:           "127.0.0.1",
			Port:           8888,
			ReadTimeout:    2000,
			WriteTimeout:   2000,
			MaxHeaderBytes: 512,
		},
	}
}
