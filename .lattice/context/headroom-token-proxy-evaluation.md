---
feature: Headroom Token Proxy Evaluation
requirement_doc: null
created: 2026-06-23
---

# Headroom Token Proxy Evaluation

> Investigated adding `headroom-ai` as a local token-compression proxy alongside rtk for Claude Code sessions; rolled back installation due to disproportionate toolchain cost on this machine. Kept for reference if retried later.

## Decisions Log

<!-- Add new at bottom. Never remove. -->

| Date | Decision | Reasoning | Alternatives Considered |
|------|----------|-----------|------------------------|
| 2026-06-23 | Headroom is complementary to rtk, not a replacement | headroom-ai's own docs state it "ships with the excellent RTK binary for shell-output rewriting" and compresses everything downstream of it. No need to remove rtk. | Replacing rtk entirely — rejected, not what the tool is designed for. |
| 2026-06-23 | Must verify `headroom --help` shows `wrap`/`init`/`unwrap` after install, not just `proxy` | PyPI package name `headroom-ai` had a wheel-only fallback version (0.2.15) that is from an unrelated, different project (`headroom-sdk/headroom`) and only supports `headroom proxy` — no Claude Code integration at all. The real project (chopratejas/headroom, now under headroomlabs-ai org) is also published as `headroom-ai` but the current release (0.27.0) needs a Rust extension built via maturin, so `pip install --only-binary=:all:` silently falls back to the old 0.2.15 wheel without warning. | None — this is a name-collision/version-fallback trap, not a design choice. |
| 2026-06-23 | `headroom wrap claude` persists changes, it is not session-scoped | Confirmed via `headroom init claude` docs (gist + deepwiki): writes `"ANTHROPIC_BASE_URL": "http://127.0.0.1:8787"` into `~/.claude/settings.json` and installs `SessionStart`/`PreToolUse` hooks that respawn the proxy reactively (`supervisor_kind: none`, no real daemon manager). Reversible via `headroom unwrap claude` (removes hooks + setting); full removal needs `headroom install remove --profile init-user` + `uv tool uninstall headroom-ai`. | N/A — documented behavior, recorded for future reference. |
| 2026-06-23 | Flagged unresolved upstream bug: 1M context window gets silently capped to 200k | When `ANTHROPIC_BASE_URL` points at a custom host (the local proxy), Claude Code does not send the `context-1m-2025-08-07` beta header, so sessions otherwise entitled to the 1M window are capped at 200k with no warning. Tracked as GitHub issue #1158 in chopratejas/headroom, open as of 2026-06-23. There's also a related bug (#951) where daemon/follow-up sessions can bypass the proxy after the first conversation. | Proceeding anyway and accepting the cap — user chose to proceed past this caveat in this session, but it remains a live risk if revisited. |
| 2026-06-23 | Discovered this machine is ARM64 (Windows 11 on ARM), not x64 | `PROCESSOR_ARCHITECTURE` reports `AMD64` inside Bash/PowerShell because those shells run under x64 emulation, but `Get-CimInstance Win32_ComputerSystem).SystemType` confirms `ARM64-based PC`. This explains why `winget install Rustlang.Rustup` initially grabbed an `aarch64-pc-windows-msvc` rustup-init while pip's build tooling was targeting `x86_64-pc-windows-msvc` — a host/target mismatch that caused the native extension build to fail. | N/A — factual discovery, not a choice. |
| 2026-06-23 | Discovered two conflicting Python 3.13 Store installs | One native ARM64 build (resolved by bare `python`, reports `platform.machine() == ARM64`), one x64 build running emulated (resolved by `pip`/`pip` alias, path contains `_x64_`). `pip` and even `python -m pip` both resolved to the x64 install's pip module during this session, so all package builds were implicitly targeting x64 under emulation rather than native ARM64. | N/A — factual discovery. Untangling this (e.g., via a venv built from the ARM64 interpreter) was not attempted in this session. |
| 2026-06-23 | Rolled back the entire headroom-ai installation | Getting `headroom-ai[all]==0.27.0` to build natively required: (a) a Rust toolchain (installed, ended up native `aarch64-pc-windows-msvc` correctly), (b) Microsoft Visual C++ Build Tools for ARM64 (~3-4GB, never installed — this is what actually blocked the native extension and the `hnswlib` dependency from compiling), and (c) fixing the ARM64/x64 pip mismatch first. Combined with `[all]` pulling in a heavy ML stack (torch, transformers, sentence-transformers, accelerate, llmlingua) just to run a local compression proxy, the cumulative cost was judged disproportionate to the benefit for now. | Push through with the ARM64 MSVC Build Tools install and pip mismatch fix — rejected for this session due to cumulative scope; documented below as the path if retried. Using `headroom-ai` without `[all]` extras — not tested, may still need the Rust extension for the core proxy regardless. |
| 2026-06-23 | Reverted all changes except Windows Long Path support | Uninstalled `headroom-ai` + ML deps (torch, transformers, sentence-transformers, litellm, accelerate, llmlingua, tree-sitter-language-pack, nltk, scikit-learn, scipy, tokenizers, huggingface-hub), uninstalled Rust (`rustup self uninstall` + winget package), removed the PATH entry added for `headroom.exe`. Left `HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem\LongPathsEnabled = 1` enabled, since that's a generally-useful Windows setting unrelated to headroom specifically (also needed by litellm's deeply nested package paths if Python packages are installed again in the future). | Reverting the long-paths registry change too — rejected, no downside to leaving it enabled. |

## Open Questions

- Has GitHub issue #1158 (1M context window dropped behind custom `ANTHROPIC_BASE_URL`) been fixed upstream in chopratejas/headroom? Check before retrying `headroom wrap claude`.
- Is the ARM64/x64 dual-Python-install mismatch worth resolving independently of headroom (e.g., for other native-extension Python packages on this machine)?
- Does `headroom-ai` (without the `[all]` extra) avoid the Rust/MSVC build requirement entirely, or does the core package still need the native extension? Not tested this session.

## Constraints

<!-- Non-negotiable once recorded. Add only when confirmed. -->

## Key Files

- `~/.claude/settings.json` — would be modified persistently by `headroom wrap claude` / `headroom init claude` (not currently modified; rolled back before this happened).
- `CLAUDE.md` (user-global, via `RTK.md`) — documents the current rtk-only setup that remains in place.

## Retry Checklist (if revisited)

1. Confirm current native arch with `(Get-CimInstance Win32_ComputerSystem).SystemType` (expect `ARM64-based PC` on this machine).
2. Resolve the ARM64/x64 Python conflict first — e.g. create a venv explicitly from the ARM64 Python interpreter rather than relying on the `pip` alias.
3. Install ARM64-native Microsoft Visual C++ Build Tools (not x64) before attempting `pip install "headroom-ai[all]"`.
4. After install, verify `headroom --version` reports `0.27.0`+ and `headroom --help` lists `wrap`/`init`/`unwrap` — not just `proxy`. If it doesn't, the wheel-only fallback happened again.
5. Check whether GitHub issue #1158 (1M context cap) is resolved before running `headroom wrap claude` on a daily-driver setup.
