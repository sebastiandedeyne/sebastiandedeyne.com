package main

import (
    "fmt"
    "os"
    "io/fs"
)

func main() {
    parentDir, _ := os.Open("content/posts")
    subDirs, _ := parentDir.ReadDir(0)

    for _, subDir := range subDirs {
        if subDir.IsDir() {
            path := "content/posts/" + subDir.Name()

            openSubDir, _ := os.Open(path)
            files, _ := openSubDir.ReadDir(0)

            for _, file := range files {
                if !file.IsDir() {
                    parseFile(file, path)
                }
            }
        }
    }
}

func parseFile(f fs.DirEntry, dir string) {
    path := dir + "/" + f.Name()

    fmt.Println(path)
}
