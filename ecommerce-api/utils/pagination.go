package utils

type Pagination struct {
	Page     int `json:"page"`
	PageSize int `json:"page_size"`
}

func (p *Pagination) GetOffset() int {
	return (p.Page - 1) * p.PageSize
}

func (p *Pagination) GetLimit() int {
	if p.PageSize <= 0 {
		return 10
	}
	return p.PageSize
}