<h1 align="center">Tag Exists<br />
<div align="center">
  
  [![Build](https://github.com/action-pack/tag-exists/actions/workflows/build.yml/badge.svg)](https://github.com/action-pack/tag-exists/)
  [![Version](https://img.shields.io/github/v/tag/action-pack/tag-exists?label=version&sort=semver&color=066da5)](https://github.com/marketplace/actions/tag-exists)
  [![Size](https://img.shields.io/github/size/action-pack/tag-exists/dist/index.js?branch=release/v1.02&label=size&color=066da5)](https://github.com/action-pack/tag-exists/)
  
</div></h1>

Action to determine if a tag exists.

## Usage

To check if the tag `v1.0` exists in your repo:
```yaml
- uses: action-pack/tag-exists@v1
  id: checkTag
  with: 
    tag: 'v1.0'

- run: echo ${{ steps.checkTag.outputs.exists }}
```

To check if the tag [`v1.0.0`](https://github.com/actions/checkout/releases/tag/v1.0.0) exists in the repo `actions/checkout`:
```yaml
- uses: action-pack/tag-exists@v1
  id: checkTag
  with: 
    tag: 'v1.0.0'
    repo: 'actions/checkout'

- run: echo ${{ steps.checkTag.outputs.exists }}
```

### `tag` 

**Required** - The tag to search for.

### `repo`

**Optional** - Repo you'd like to search, in `owner/repo-name` format.

## Outputs

### `exists`

A string value of 'true' or 'false'
