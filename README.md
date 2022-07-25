# Boulevard GitHub Actions

This repo provides a collection of reusable GitHub actions.

## Usage

```yml
- name: Calculate new percent coverage
  id: new-percent-coverage
  uses: Boulevard/gh-actions/jest-coverage-calculator@main
  with:
    coverage: ${{ steps.new-coverage.outputs.json }}
```
