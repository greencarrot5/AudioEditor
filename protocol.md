# AudioEditor project save protocol

(All numbers larger than 1 byte are in big endian)

# AEPS protocol version 1

## General protocol

| Description | Length (bytes) |
|-------------|----------------|
| Protocol version | 1 |
| Amount of imported items | 2 |
| Imported items | Depends |
| Amount of used items | 2 |
| Used items | Depends |

## Imported item protocol

| Description | Length (bytes) |
|-------------|----------------|
| Length of name | 2 |
| Name | len(name) |
| Length of content | 8 |
| Content | len(content) |

## Used item protocol

| Description | Length (bytes) |
|-------------|----------------|
| Length of name | 2 |
| Name | len(name) |
| Length of content | 8 |
| Content | len(content) |
| Timestamp * 1.000.000 | 5 |
| Duration * 1.000.000 | 5 |