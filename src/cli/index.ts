import { match, P } from "ts-pattern";
import { runInstallCommand } from "./install.js";
import { runSkillCommand } from "./skill.js";

const argv = process.argv.slice(2);
const sub = argv[0] ?? "install";
const rest = argv.slice(1);

match(sub)
  .with("install", () => {
    runCommand(runInstallCommand(rest));
  })
  .with("skill", () => {
    runCommand(runSkillCommand(rest));
  })
  .with("--help", () => {
    printUsage();
    process.exit(0);
  })
  .with("-h", () => {
    printUsage();
    process.exit(0);
  })
  .with(P.string, () => {
    process.stderr.write(`sadist: unknown command: ${sub}\n`);
    printUsage();
    process.exit(1);
  })
  .exhaustive();

function runCommand(r: { ok: true; value: string } | { ok: false; error: string }): void {
  match(r)
    .with({ ok: true }, (v) => {
      process.stdout.write(`sadist: ${v.value}\n`);
      process.exit(0);
    })
    .with({ ok: false }, (e) => {
      process.stderr.write(`sadist: error: ${e.error}\n`);
      process.exit(1);
    })
    .exhaustive();
}

function printUsage(): void {
  process.stdout.write(
    [
      "sadist - A sadistic TypeScript gate that holds your commit hostage until the code is no longer a liability.",
      "",
      "usage:",
      "  sadist install [flags]    configure a project with the gate",
      "  sadist skill [flags]      install or update the sadist skill file",
      "  sadist --help             show this help",
      "",
      "install flags:",
      "  --no-husky     skip pre-commit hook setup",
      "  --no-tsconfig  skip tsconfig.json creation",
      "  --force        overwrite existing files",
      "  --dry-run      print plan without applying changes",
      "",
    ].join("\n"),
  );
}
