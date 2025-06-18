package models

type Response struct {
    Data   interface{} `json:"data"`
    Status int         `json:"status"`
    Error  string      `json:"error,omitempty"`
    Detail string      `json:"detail,omitempty"`
}