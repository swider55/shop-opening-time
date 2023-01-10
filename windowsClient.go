package main

import (
    "crypto/tls"
    "fmt"
    "net/http"
)

func main() {
    tr := &http.Transport{
        TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
    }
    client := &http.Client{Transport: tr}

    req, err := http.NewRequest("GET", "https://138.68.95.165", nil)
    if err != nil {
        fmt.Println(err)
        return
    }
    req.SetBasicAuth("szperk", "aR-y33)162")

    resp, err := client.Do(req)
    if err != nil {
        fmt.Println(err)
        return
    }

    defer resp.Body.Close()

    fmt.Println(resp)
}