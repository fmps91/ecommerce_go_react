package models

type Response struct {
    Data   interface{} `json:"data"`
    Status int         `json:"status"`
    TypeError  error   `json:"typeerror,omitempty"`
    Error  string      `json:"error,omitempty"`
    Detail string      `json:"detail,omitempty"`
}