# Boulevard GitHub Actions

This repo provides a collection of reusable GitHub actions.

## Jest

This action runs Jest tests and collects coverage data.

### Example usage

```yml
- name: Run tests
  uses: Boulevard/gh-actions/jest@main
  with:
    run-url: ${{ fromJSON(steps.get-run-url.outputs.result) }}
```

## Jest coverage calculator

This action computes the mean percent coverage.

### Example usage

```yml
- name: Calculate new percent coverage
  id: new-percent-coverage
  uses: Boulevard/gh-actions/jest-coverage-calculator@main
  with:
    coverage: ${{ steps.new-coverage.outputs.json }}
```

## Create S3 Artifact

This action uploads an artifact to S3.

### Example usage

```yml
- name: Create coverage badge artifact
  env:
    percent: ${{ steps.new-percent-coverage.outputs.percent }}
  if: inputs.generate-artifacts == 'true'
  uses: Boulevard/gh-actions/create-s3-artifact@main
  with:
    artifact: |
      {
        "schemaVersion": 1,
        "label": "coverage",
        "message": "${{ env.percent }}%",
        "color": "${{
          (env.percent < 25 && 'red') ||
          (env.percent < 50 && 'orange') ||
          (env.percent < 75 && 'yellow') ||
          'brightgreen'
        }}"
      }
    aws-access-key-id: ${{ inputs.aws-access-key-id }}
    aws-secret-access-key: ${{ inputs.aws-secret-access-key }}
    cache-control: no-cache
    public: true
    s3-bucket-name: ${{ inputs.s3-bucket-name }}
    s3-object-key: ${{ inputs.s3-object-path }}/coverage-shield.json
```
