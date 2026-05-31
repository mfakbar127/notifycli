# notifycli

Unified notification system CLI for testing and sending notifications through external messaging providers.

## Screenshots

<details>
<summary>Click to view screenshots</summary>

```bash
# Help output
$ notifycli --help
notifycli - Unified notification system CLI

Usage:
  notifycli --provider <profile> --text <message>
  notifycli --provider <profile> --text-file <path>
  notifycli --provider <profile> --test

Options:
  --provider <name>     Profile name from configuration (required)
  --text <message>      Message text to send
  --text-file <path>    Path to file containing message
  --test                Test profile connectivity
  --config <path>       Path to configuration file
  --json                Output in JSON format
  --help                Show this help message
  --version             Show version number
```

</details>

## Install

Build and link locally:

```bash
bun install
bun run build
npm link
```

Then use the `notifycli` command anywhere:

```bash
notifycli --help
```

## Run

```bash
# Send a message
notifycli --provider discord-alerts --text "Hello World"

# Send message from file
notifycli --provider slack-eng --text-file incident.txt

# Test profile connectivity
notifycli --provider discord-security --test

# Use custom config
notifycli --config ./myconfig.yaml --provider my-profile --text "Test"

# JSON output for automation
notifycli --provider discord-alerts --text "Hello" --json
```
