<h1 align="center">Send Mail<br />
<div align="center">
  
  [![Build](https://github.com/action-pack/send-mail/actions/workflows/build.yml/badge.svg)](https://github.com/action-pack/send-mail/)
  [![Version](https://img.shields.io/github/v/tag/action-pack/send-mail?label=version&sort=semver&color=066da5)](https://github.com/marketplace/actions/send-mail)
  [![Size](https://img.shields.io/github/size/action-pack/send-mail/dist/index.js?branch=release/v1.00&label=size&color=066da5)](https://github.com/action-pack/send-mail/)
  
</div></h1>

Action to send an email.

## Usage

To check if a tag named `example` exists in your current repository:

```yaml
- uses: action-pack/tag-exists@v1
  id: check
  with: 
    tag: 'example'

- run: echo ${{ steps.check.outputs.exists }}
```

## Inputs

### `tag` 

**Required** - The tag to search for.

### `repo`

**Optional** - External repository name in`owner/repo` format.

## Outputs

### `exists`

A string value of 'true' or 'false'

## Stars
[![Stars](https://starchart.cc/action-pack/send-mail.svg?variant=adaptive)](https://starchart.cc/action-pack/send-mail)
