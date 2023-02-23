package main

import (
    "crypto/tls"
    "fmt"
    "net/http"
    "time"
    "bufio"
    "os"
)

func sendRequest() bool {
    tr := &http.Transport{
        TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
    }
    client := &http.Client{Transport: tr}

    req, err := http.NewRequest("GET", "https://138.68.95.165", nil)
    if err != nil {
        fmt.Println(err)
        return false
    }
    req.SetBasicAuth("szperk", "aR-y33)162")

    resp, err := client.Do(req)
    if err != nil {
        fmt.Println(err)
        return false
    }

    defer resp.Body.Close()

    fmt.Println(resp)
    return true
}

func main() {
    if !sendRequest() {
        fmt.Println("Can not send information about opened shop to server. I will try again in 10 second")
        time.Sleep(10 * time.Second)
        if !sendRequest() {
            fmt.Println("The problem still appears. Please contact with administrator");
            fmt.Print("Press 'Enter' to close Windows")
            bufio.NewReader(os.Stdin).ReadBytes('\n')
        }
    }
}