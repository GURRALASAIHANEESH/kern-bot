export interface TopicSeed {
    id: string;
    category: string;
    slug: string;
    title: string;
    summary: string;
    keywords: string[];
    content: string; // Rich content — this is what gets injected as context
    examples?: string[]; // Concrete command examples
    commonMistakes?: string[]; // What beginners get wrong
    relatedSlugs?: string[]; // Cross-references
}

export const KNOWLEDGE_BASE: TopicSeed[] = [
    // ─── SHELL ────────────────────────────────────────────────────────────────
    {
        id: "shell-001",
        category: "Shell",
        slug: "bash-scripting-fundamentals",
        title: "Bash Scripting Fundamentals",
        keywords: [
            "bash", "script", "shebang", "variable", "loop", "for", "while",
            "if", "function", "exit", "return", "source", "chmod", "execute",
        ],
        summary:
            "Variables, loops, conditionals, functions, exit codes, and script best practices in bash.",
        content: `
Bash scripts must start with a shebang: #!/usr/bin/env bash (preferred over #!/bin/bash for portability).

Variables: No spaces around =. Use double quotes around variables to prevent word splitting: "$var".
Use local inside functions to avoid polluting global scope.

Exit codes: Every command returns 0 (success) or 1–255 (failure). Check with $?.
Use 'set -euo pipefail' at the top of every production script:
  -e  exit on error
  -u  treat unset variables as errors
  -o pipefail  catch errors inside pipes

Functions: Defined with function_name() { ... }. Return values via exit codes, not return strings.
To return a string, use echo and capture with $().

Conditionals use [[ ]] (bash built-in, preferred) over [ ] (POSIX sh, more limited).
String comparison: [[ "$a" == "$b" ]]
Numeric comparison: [[ $n -gt 5 ]] or (( n > 5 ))

Loops:
  for f in *.log; do echo "$f"; done
  while IFS= read -r line; do echo "$line"; done < file.txt
    `.trim(),
        examples: [
            '#!/usr/bin/env bash\nset -euo pipefail\n\nprocess_file() {\n  local file="$1"\n  [[ -f "$file" ]] || { echo "Not a file: $file" >&2; return 1; }\n  wc -l "$file"\n}\n\nprocess_file "$1"',
            'for dir in /var/log/*/; do\n  echo "Checking: $dir"\n  du -sh "$dir"\ndone',
        ],
        commonMistakes: [
            "Using = instead of == in [[ ]] comparisons (both work but == is clearer)",
            "Not quoting variables — leads to word splitting bugs with filenames containing spaces",
            "Using $() vs backticks — always use $() for nesting and readability",
            "Forgetting set -euo pipefail — silent failures in production scripts",
        ],
        relatedSlugs: ["pipes-and-redirection", "process-management"],
    },

    {
        id: "shell-002",
        category: "Shell",
        slug: "pipes-and-redirection",
        title: "Pipes, Redirection & Process Substitution",
        keywords: [
            "pipe", "redirect", "stdin", "stdout", "stderr", "tee", "heredoc",
            "xargs", "process substitution", "2>&1", "dev null", "/dev/null",
            "here document", "herestring",
        ],
        summary:
            "stdin/stdout/stderr, pipe chaining, tee, here-docs, process substitution with <() and >().",
        content: `
File descriptors: 0=stdin, 1=stdout, 2=stderr.
Redirect stdout: command > file (overwrite) or command >> file (append)
Redirect stderr: command 2> error.log
Redirect both: command > out.log 2>&1 (order matters — stderr redirects to where stdout currently points)
Discard output: command > /dev/null 2>&1

Pipes connect stdout of one command to stdin of the next.
pipefail makes the whole pipeline fail if any stage fails (set -o pipefail).

tee: write to file AND continue the pipe
  command | tee output.log | next-command

Process substitution: treats command output as a file — no subshell variable scope issues
  diff <(sort file1) <(sort file2)
  while IFS= read -r line; do ...; done < <(find . -name "*.log")

Here-documents: multi-line stdin without a temp file
  cat <<EOF
  line one
  line two
  EOF

xargs: build and execute command lines from stdin
  find . -name "*.tmp" | xargs rm -f
  find . -name "*.log" | xargs -P4 -I{} gzip {}   # parallel with 4 jobs
    `.trim(),
        examples: [
            "# Find errors in last 100 lines, count by type\ntail -n100 /var/log/syslog | grep ERROR | awk '{print $NF}' | sort | uniq -c | sort -rn",
            "# Compare two sorted lists without temp files\ndiff <(sort /etc/passwd | cut -d: -f1) <(getent passwd | cut -d: -f1)",
        ],
        commonMistakes: [
            "2>&1 order: 'cmd > file 2>&1' works, 'cmd 2>&1 > file' does NOT redirect stderr to file",
            "Using $(cat file) when you can just redirect: command < file",
            "xargs with filenames containing spaces — use -d'\\n' or find -print0 | xargs -0",
        ],
        relatedSlugs: ["bash-scripting-fundamentals", "text-processing"],
    },

    {
        id: "shell-003",
        category: "Shell",
        slug: "text-processing",
        title: "Text Processing: grep, awk, sed",
        keywords: [
            "grep", "awk", "sed", "cut", "sort", "uniq", "tr", "wc",
            "regex", "pattern", "field", "column", "stream editor",
        ],
        summary:
            "Production-grade text processing with grep, awk, and sed — the three tools you use every day.",
        content: `
grep: search for patterns
  -E  extended regex (egrep equivalent)
  -F  fixed string, no regex (fastest)
  -r  recursive directory search
  -l  print filenames only
  -n  show line numbers
  -v  invert match
  -i  case-insensitive
  -A/-B/-C N: show N lines after/before/around match
  grep -rn "TODO" --include="*.go" ./src

awk: field-based processing — think of it as a mini programming language
  Default field separator is whitespace. $1, $2... are fields. $0 is the whole line.
  awk '{print $1, $NF}' file          # first and last field
  awk -F: '{print $1}' /etc/passwd    # colon-delimited
  awk '$3 > 100 {print $0}' file      # conditional
  awk 'BEGIN{sum=0} {sum+=$1} END{print sum}' file  # accumulator

sed: stream editor — find and replace, line operations
  sed 's/old/new/g' file              # replace all occurrences
  sed -n '10,20p' file                # print lines 10-20
  sed '/pattern/d' file               # delete matching lines
  sed -i.bak 's/foo/bar/g' file       # in-place edit with backup
  sed -E 's/([0-9]+)/[\\1]/g' file    # backreferences with -E
    `.trim(),
        examples: [
            "# Extract all IP addresses from a log file\ngrep -Eo '([0-9]{1,3}\\.){3}[0-9]{1,3}' access.log | sort | uniq -c | sort -rn | head -20",
            "# Get memory usage per process, sorted\nps aux | awk 'NR>1 {print $4, $11}' | sort -rn | head -10",
            "# Replace config value in-place safely\nsed -i.bak 's/^MAX_CONNECTIONS=.*/MAX_CONNECTIONS=200/' /etc/myapp/config",
        ],
        commonMistakes: [
            "sed -i without .bak backup — always keep a backup for in-place edits",
            "Using grep when awk handles the condition more cleanly",
            "Forgetting awk field separator -F for non-whitespace delimited files",
        ],
        relatedSlugs: ["pipes-and-redirection", "bash-scripting-fundamentals"],
    },

    // ─── KERNEL ───────────────────────────────────────────────────────────────
    {
        id: "kernel-001",
        category: "Kernel",
        slug: "process-management",
        title: "Process Management & Signals",
        keywords: [
            "process", "pid", "fork", "exec", "signal", "kill", "killall", "pkill",
            "zombie", "orphan", "wait", "SIGTERM", "SIGKILL", "SIGHUP", "SIGINT",
            "ps", "pgrep", "top", "htop", "/proc",
        ],
        summary:
            "fork/exec model, /proc filesystem, signals, zombie and orphan processes, process inspection.",
        content: `
Every process has a PID, PPID (parent), UID, and file descriptor table.
fork() creates an identical copy of the parent. exec() replaces the process image.
init (PID 1) is the ancestor of all processes and adopts orphans.

/proc/<pid>/ exposes live process state:
  /proc/<pid>/status     — human-readable state, memory, uid
  /proc/<pid>/cmdline    — full command line (null-separated)
  /proc/<pid>/fd/        — open file descriptors
  /proc/<pid>/maps       — memory map
  /proc/<pid>/environ    — environment variables

Signals are async notifications to processes:
  SIGTERM (15) — graceful shutdown request. Handler can be caught.
  SIGKILL (9)  — unconditional kill. Cannot be caught or ignored. Last resort.
  SIGHUP (1)   — hangup. Daemons use this to reload config without restart.
  SIGINT (2)   — keyboard interrupt (Ctrl+C)
  SIGSTOP/SIGCONT — pause/resume a process

kill sends signals: kill -SIGTERM <pid> or kill -15 <pid>
pkill matches by name: pkill -HUP nginx
killall: kills all processes by name

Zombie process: a process that has exited but whose parent hasn't called wait().
  It holds a PID and an entry in the process table — no memory, no CPU.
  Fix: fix the parent to call wait(), or kill the parent (init adopts and reaps).
  Detect: ps aux | grep 'Z'

## SIGTERM vs SIGQUIT
SIGTERM (15): Default kill signal. Catchable, ignorable. No core dump. 
Process should flush buffers, close sockets, remove temp files, exit cleanly.
Sent by: kill <pid>, systemd stop, Docker stop (10s timeout then SIGKILL).

SIGQUIT (3): Catchable, ignorable. Generates a core dump before exiting.
Keyboard: Ctrl+\\ in terminal.
Used for: debugging — you get a snapshot of memory at the moment of termination.
Core dump written to: path defined in /proc/sys/kernel/core_pattern (default: ./core)
Enable core dumps: ulimit -c unlimited

SIGKILL (9): Cannot be caught or ignored. Kernel terminates immediately.
No cleanup. No core dump. Use as last resort.

SIGINT (2): Ctrl+C. Catchable. No core dump. Intended for user interruption.

Signal catchability:
- Catchable and ignorable: SIGTERM, SIGQUIT, SIGINT, SIGHUP
- Cannot catch or ignore: SIGKILL (9), SIGSTOP (19)
    `.trim(),
        examples: [
            "# Find what's listening on port 8080\nss -tlnp | grep :8080\n# or\nlsof -i :8080",
            "# Kill a process gracefully, then forcefully if needed\nkill -SIGTERM $PID\nsleep 5\nkill -0 $PID 2>/dev/null && kill -SIGKILL $PID",
            "# Find zombie processes\nps aux | awk '$8 == \"Z\" {print $0}'",
            "# Check signal dispositions of a running process\ncat /proc/<pid>/status | grep -i sig",
            "# Send signals\nkill -TERM <pid>    # graceful shutdown\nkill -QUIT <pid>    # terminate + core dump\nkill -KILL <pid>    # force kill, no cleanup",
            "# Enable core dumps for current shell session\nulimit -c unlimited\necho '/tmp/core.%e.%p' > /proc/sys/kernel/core_pattern",
        ],
        commonMistakes: [
            "Reaching for SIGKILL first — always try SIGTERM first and give the process time to clean up",
            "Confusing zombie (exited, not reaped) with orphan (parent died, adopted by init)",
            "Using kill on a PID without verifying it still belongs to the expected process",
            "Using kill -9 as default — always try SIGTERM first, give the process time to clean up",
            "Not enabling ulimit -c unlimited before expecting a core dump from SIGQUIT",
            "Confusing SIGQUIT (core dump) with SIGKILL (no dump, immediate kill)",
        ],
        relatedSlugs: ["cgroups-namespaces", "observability-strace"],
    },

    {
        id: "kernel-002",
        category: "Kernel",
        slug: "cgroups-namespaces",
        title: "cgroups v2 & Linux Namespaces",
        keywords: [
            "cgroup", "cgroups", "cgroupv2", "namespace", "container", "docker",
            "resource", "limit", "cpu", "memory", "pid namespace", "net namespace",
            "unshare", "nsenter", "systemd-cgtop",
        ],
        summary:
            "Resource isolation with cgroups v2 and Linux namespaces — the primitives that power containers.",
        content: `
cgroups (control groups) limit and account for resource usage per group of processes.
cgroups v2 (unified hierarchy) is the modern standard — one tree under /sys/fs/cgroup/.
  v1 had per-subsystem trees (messy). v2 is cleaner, used by systemd and Docker now.

Key controllers in v2:
  cpu       — CPU bandwidth limiting with cpu.max (quota/period)
  memory    — memory.max, memory.high (soft limit), memory.swap.max
  io        — block I/O throttling
  pids      — limit number of processes/threads (pids.max)

Read a process's cgroup: cat /proc/<pid>/cgroup
Current cgroup hierarchy: ls /sys/fs/cgroup/

Linux Namespaces isolate process views of system resources:
  pid     — process sees its own PID tree (PID 1 inside containers)
  net     — separate network stack, interfaces, routing
  mnt     — separate filesystem mount tree
  uts     — separate hostname and domain name
  ipc     — separate System V IPC, POSIX message queues
  user    — separate UID/GID mappings (rootless containers)
  time    — separate system clock offsets (Linux 5.6+)

unshare: create new namespaces for a process
  unshare --pid --fork --mount-proc bash   # new pid namespace

nsenter: enter an existing namespace (e.g., debug a container)
  nsenter -t <pid> --net -- ip addr        # enter container's network namespace
    `.trim(),
        examples: [
            "# Check Docker container cgroup limits\ncat /sys/fs/cgroup/system.slice/docker-<id>.scope/memory.max",
            "# Run a process in a memory-limited cgroup (cgroupv2)\nmkdir /sys/fs/cgroup/test\necho '104857600' > /sys/fs/cgroup/test/memory.max  # 100MB\necho $$ > /sys/fs/cgroup/test/cgroup.procs",
            "# Enter a running container's network namespace\nPID=$(docker inspect -f '{{.State.Pid}}' my-container)\nnsenter -t $PID --net -- ss -tlnp",
        ],
        commonMistakes: [
            "Mixing cgroupv1 and v2 APIs — check which version is active: stat -fc %T /sys/fs/cgroup/",
            "Setting memory.max without memory.swap.max — process can still use swap",
        ],
        relatedSlugs: ["process-management", "linux-security"],
    },

    {
        id: "kernel-003",
        category: "Kernel",
        slug: "memory-management",
        title: "Memory Management & OOM Killer",
        keywords: [
            "memory", "oom", "oom killer", "swap", "paging", "virtual memory",
            "hugepages", "mmap", "slab", "cache", "buffer", "overcommit",
            "/proc/meminfo", "smaps", "valgrind",
        ],
        summary:
            "Virtual memory, paging, OOM killer behavior, /proc/meminfo, swap, and memory pressure diagnostics.",
        content: `
Linux uses virtual memory — each process gets its own address space mapped to physical pages.
Pages are 4KB by default. Huge pages (2MB/1GB) reduce TLB pressure for large datasets.

/proc/meminfo breakdown:
  MemTotal    — total physical RAM
  MemFree     — completely unused RAM
  MemAvailable — estimated RAM available for new processes (includes reclaimable cache)
  Buffers     — kernel buffer cache (raw disk blocks)
  Cached      — page cache (file contents) — this is "used but reclaimable"
  SwapCached  — data in swap that's also in RAM

Memory overcommit: Linux allows processes to allocate more memory than physically available.
  /proc/sys/vm/overcommit_memory: 0=heuristic, 1=always allow, 2=never overcommit

OOM Killer: when memory is exhausted, kernel selects and kills a process.
  Selection is based on oom_score (0–1000). Higher score = more likely to die.
  /proc/<pid>/oom_score — current score
  /proc/<pid>/oom_score_adj — adjust (-1000 to 1000). Set -1000 to protect a process.
  OOM events: dmesg | grep -i "oom\|killed process"

Swap: overflow to disk. Slow but prevents OOM kills.
  Check usage: free -h, swapon --show
  Swappiness: /proc/sys/vm/swappiness (0=avoid swap, 60=default, 100=aggressive)
    `.trim(),
        examples: [
            "# Check what's using memory right now\nps aux --sort=-%mem | head -15",
            "# Protect critical process from OOM killer\necho -1000 > /proc/$(pgrep postgres)/oom_score_adj",
            "# Diagnose OOM kills in logs\ndmesg -T | grep -E 'oom|killed process|memory'",
        ],
        commonMistakes: [
            "Trusting 'MemFree' — MemAvailable is the correct metric for free memory",
            "Setting swappiness=0 on servers — this doesn't disable swap, use swappiness=1 instead",
        ],
        relatedSlugs: ["process-management", "observability-strace"],
    },

    // ─── NETWORKING ───────────────────────────────────────────────────────────
    {
        id: "net-001",
        category: "Networking",
        slug: "networking-tools",
        title: "Linux Networking Diagnostics",
        keywords: [
            "ss", "netstat", "ip", "route", "ping", "traceroute", "dig", "nslookup",
            "tcpdump", "nmap", "curl", "wget", "nc", "netcat", "port", "socket",
            "interface", "listen", "connection", "established",
        ],
        summary:
            "ss, ip, tcpdump, dig, curl — systematic network debugging on Linux.",
        content: `
ss (socket statistics) — modern replacement for netstat. Faster, more info.
  ss -tlnp    — TCP listening sockets with process info
  ss -tnp     — all TCP connections with process info
  ss -s       — summary statistics
  ss -tlnp sport = :80   — filter by port

ip — modern replacement for ifconfig/route
  ip addr show          — all interfaces and IPs
  ip link set eth0 up   — bring interface up
  ip route show         — routing table
  ip route add default via 192.168.1.1  — set default gateway
  ip neigh show         — ARP table

tcpdump — capture and inspect packets
  tcpdump -i eth0 port 80 -n          — HTTP traffic, no DNS resolution
  tcpdump -i any host 10.0.0.1 -w capture.pcap   — write to file
  tcpdump -r capture.pcap -A | grep Host   — read and search

dig — DNS queries
  dig google.com A              — A record
  dig google.com MX             — mail records
  dig @8.8.8.8 google.com      — query specific resolver
  dig +short google.com         — minimal output
  dig +trace google.com         — full resolution path

curl for API/HTTP testing:
  curl -sv https://api.example.com/health    — verbose with headers
  curl -o /dev/null -w "%{http_code} %{time_total}" https://example.com
    `.trim(),
        examples: [
            "# Full port investigation workflow\nss -tlnp | grep :8080\nlsof -i :8080\nps -p <pid> -o pid,ppid,cmd",
            "# Check if remote port is open (no nmap needed)\nnc -zv 10.0.0.5 5432 2>&1",
            "# Capture traffic to/from specific IP for 10 seconds\ntcpdump -i eth0 host 10.0.0.5 -w /tmp/debug.pcap -G 10 -W 1",
        ],
        commonMistakes: [
            "Using netstat over ss — ss is faster and available everywhere now",
            "Forgetting -n in ss/tcpdump — DNS lookups slow everything down during debugging",
        ],
        relatedSlugs: ["iptables-nftables", "process-management"],
    },

    {
        id: "net-002",
        category: "Networking",
        slug: "iptables-nftables",
        title: "iptables & nftables",
        keywords: [
            "iptables", "nftables", "firewall", "nat", "masquerade", "chain",
            "rule", "conntrack", "INPUT", "OUTPUT", "FORWARD", "PREROUTING",
            "POSTROUTING", "DROP", "ACCEPT", "REJECT", "ip6tables",
        ],
        summary:
            "Packet filtering, NAT, chain traversal, conntrack, and migrating from iptables to nftables.",
        content: `
iptables uses tables > chains > rules.
  Tables: filter (default), nat, mangle, raw
  Built-in chains: INPUT, OUTPUT, FORWARD (filter); PREROUTING, POSTROUTING (nat)

Rule traversal: packet goes through rules top-to-bottom. First match wins.
  -A append, -I insert at position, -D delete, -L list, -F flush

Common operations:
  iptables -A INPUT -p tcp --dport 22 -j ACCEPT
  iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
  iptables -A INPUT -j DROP  # default deny at end

NAT / masquerade for internet sharing:
  iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
  echo 1 > /proc/sys/net/ipv4/ip_forward

nftables is the modern replacement (kernel 3.13+, default in Debian 10+):
  Single tool replaces iptables, ip6tables, arptables, ebtables
  Better performance, atomic rule updates
  nft list ruleset
  nft add rule ip filter input tcp dport 22 accept

Save and restore:
  iptables-save > /etc/iptables/rules.v4
  iptables-restore < /etc/iptables/rules.v4
    `.trim(),
        examples: [
            "# Allow established connections, allow SSH, drop everything else\niptables -F\niptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\niptables -A INPUT -i lo -j ACCEPT\niptables -A INPUT -p tcp --dport 22 -j ACCEPT\niptables -P INPUT DROP",
            "# Port forwarding: redirect port 80 to 8080 locally\niptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080",
        ],
        commonMistakes: [
            "Flushing iptables without a default ACCEPT policy — locks yourself out over SSH",
            "Not persisting rules — iptables rules are lost on reboot without iptables-save",
            "Using -j REJECT vs -j DROP — REJECT sends ICMP back (tells the client), DROP silently ignores",
        ],
        relatedSlugs: ["networking-tools", "linux-security"],
    },

    // ─── FILESYSTEM ───────────────────────────────────────────────────────────
    {
        id: "fs-001",
        category: "Filesystem",
        slug: "permissions-acls",
        title: "Permissions, ACLs & Capabilities",
        keywords: [
            "permission", "chmod", "chown", "umask", "acl", "setfacl", "getfacl",
            "capability", "suid", "sgid", "sticky", "bit", "octal", "rwx",
            "ls -l", "stat",
        ],
        summary:
            "chmod, chown, umask, sticky/SUID/SGID bits, POSIX ACLs, and Linux capabilities.",
        content: `
Standard permissions: owner, group, others × read(4), write(2), execute(1)
  chmod 755 file  →  rwxr-xr-x
  chmod u+x,g-w file
  chown user:group file

Special bits:
  SUID (4000): execute as file owner. chmod u+s binary
    Example: /usr/bin/passwd runs as root regardless of caller
    Security risk if set on scripts or writable binaries
  SGID (2000): execute as file group. On directories: new files inherit group.
  Sticky (1000): on directories, only owner can delete their files.
    Example: /tmp has sticky bit → you can't delete others' temp files

umask: subtracts from default permissions (file: 666, dir: 777)
  umask 022 → files: 644, dirs: 755
  umask 027 → files: 640, dirs: 750 (more restrictive, good for servers)

POSIX ACLs: fine-grained permissions beyond owner/group/others
  setfacl -m u:alice:rw file    # give alice read+write
  setfacl -m g:devs:rx dir      # give devs group read+execute
  getfacl file                   # inspect ACLs
  setfacl -x u:alice file        # remove ACL entry

Linux Capabilities: break root privileges into discrete units
  cap_net_bind_service: bind to ports < 1024 without root
  cap_sys_ptrace: trace processes
  getcap /usr/bin/ping
  setcap cap_net_bind_service+ep /usr/bin/node
    `.trim(),
        examples: [
            "# Find all SUID binaries (security audit)\nfind / -perm -4000 -type f 2>/dev/null | sort",
            "# Allow node to bind port 80 without sudo\nsetcap cap_net_bind_service+ep $(which node)\n# Verify\ngetcap $(which node)",
        ],
        commonMistakes: [
            "Setting SUID on shell scripts — Linux ignores SUID on interpreted scripts for security",
            "chmod -R 777 to fix permission errors — this is a security disaster, diagnose instead",
        ],
        relatedSlugs: ["linux-security", "inodes-mounts"],
    },

    // ─── SYSTEMD ──────────────────────────────────────────────────────────────
    {
        id: "sys-001",
        category: "SystemD",
        slug: "systemd-units",
        title: "systemd Units & Service Management",
        keywords: [
            "systemd", "systemctl", "journalctl", "unit", "service", "timer",
            "socket", "target", "daemon", "enable", "start", "restart", "status",
            "ExecStart", "WantedBy", "After", "Requires", "EnvironmentFile",
        ],
        summary:
            "Unit files, service/timer/socket units, journalctl, systemctl, writing production service units.",
        content: `
systemd unit files live in:
  /etc/systemd/system/      — local admin units (highest priority)
  /usr/lib/systemd/system/  — package-installed units
  /run/systemd/system/      — runtime units

A minimal production service unit:
  [Unit]
  Description=My Application
  After=network.target
  Wants=network-online.target

  [Service]
  Type=simple
  User=appuser
  Group=appuser
  WorkingDirectory=/opt/myapp
  ExecStart=/usr/bin/node /opt/myapp/server.js
  Restart=always
  RestartSec=5
  EnvironmentFile=/etc/myapp/env
  StandardOutput=journal
  StandardError=journal

  [Install]
  WantedBy=multi-user.target

Key directives:
  Type: simple (default), exec, forking, oneshot, notify, dbus
  Restart: always, on-failure, on-abnormal, no
  After/Before: ordering (does not imply dependency)
  Requires/Wants: dependency (Requires = hard, Wants = soft)
  EnvironmentFile: load env vars from a file

systemctl commands:
  systemctl daemon-reload       — reload unit files after editing
  systemctl enable --now myapp  — enable at boot + start now
  systemctl status myapp        — current state with recent logs
  systemctl restart myapp
  systemctl show myapp          — all properties

Timers (cron replacement):
  OnCalendar=*-*-* 02:30:00    — daily at 2:30am
  OnBootSec=5min               — 5 minutes after boot
    `.trim(),
        examples: [
            "# Full workflow: create, enable, and verify a service\nsudo systemctl daemon-reload\nsudo systemctl enable --now myapp.service\nsystemctl status myapp.service\njournalctl -u myapp.service -f",
            "# Debug a failing service\njournalctl -u myapp.service -n 50 --no-pager\nsystemctl show myapp.service | grep -E 'ExecStart|Restart|MainPID'",
        ],
        commonMistakes: [
            "Forgetting daemon-reload after editing a unit file — old definition stays loaded",
            "Using Type=forking for non-forking processes — causes systemd to think startup failed",
            "Putting secrets directly in unit files — use EnvironmentFile pointing to a 0600 file",
        ],
        relatedSlugs: ["process-management", "linux-security"],
    },

    // ─── OBSERVABILITY ────────────────────────────────────────────────────────
    {
        id: "obs-001",
        category: "Observability",
        slug: "observability-strace",
        title: "Debugging with strace, lsof & perf",
        keywords: [
            "strace", "ltrace", "lsof", "perf", "bpftrace", "dmesg",
            "debug", "trace", "syscall", "profile", "flamegraph",
            "open", "read", "write", "connect", "hang", "slow",
        ],
        summary:
            "strace, lsof, perf — how to trace syscalls, open files, and profile CPU on live systems.",
        content: `
strace: trace system calls made by a process
  strace -p <pid>                   — attach to running process
  strace -e trace=file command      — only file-related syscalls
  strace -e trace=network command   — only network syscalls
  strace -c command                 — count and summarize syscalls
  strace -T command                 — show time spent per syscall
  strace -f command                 — follow forks (child processes too)

Reading strace output:
  openat(AT_FDCWD, "/etc/hosts", O_RDONLY) = 3
  read(3, "127.0.0.1...", 4096) = 127
  A return value of -1 means error: check errno
  ENOENT = file not found, EACCES = permission denied

lsof (list open files): everything is a file in Linux
  lsof -p <pid>                     — all files opened by process
  lsof -i :5432                     — what's using port 5432
  lsof -u username                  — files opened by user
  lsof +D /var/log                  — all processes with files in directory
  lsof -p <pid> | grep deleted      — find deleted files still held open (disk leak)

perf: CPU profiling without instrumentation
  perf top                          — live top by symbol
  perf record -g -p <pid> -- sleep 10   — record for 10s
  perf report                       — interactive flamegraph-style report
  perf stat command                 — hardware counter summary
    `.trim(),
        examples: [
            "# Find what config files a binary is reading\nstrace -e trace=openat myapp 2>&1 | grep -v ENOENT",
            "# Find deleted files holding disk space\nlsof / | grep deleted | awk '{print $1, $2, $7, $9}' | sort -k3 -rn | head -20",
            "# Quick CPU profile of a running process\nperf record -g -p $(pgrep myapp) -- sleep 30\nperf report --stdio | head -40",
        ],
        commonMistakes: [
            "Attaching strace to production processes at high frequency — it slows the process significantly",
            "Not using -e trace= filter — tracing all syscalls generates too much noise",
        ],
        relatedSlugs: ["process-management", "systemd-units"],
    },

    // ─── SECURITY ─────────────────────────────────────────────────────────────
    {
        id: "sec-001",
        category: "Security",
        slug: "linux-security",
        title: "Linux Security Hardening",
        keywords: [
            "sudo", "sudoers", "pam", "selinux", "apparmor", "audit", "auditd",
            "ssh", "hardening", "seccomp", "capability", "privilege", "escalation",
            "sshd_config", "fail2ban", "umask", "noexec", "nosuid",
        ],
        summary:
            "sudo hardening, SSH config, PAM, SELinux/AppArmor basics, and practical server hardening steps.",
        content: `
SSH hardening (/etc/ssh/sshd_config):
  PermitRootLogin no
  PasswordAuthentication no
  PubkeyAuthentication yes
  AllowUsers deploy admin
  Port 2222                        # non-default port reduces scan noise
  MaxAuthTries 3
  ClientAliveInterval 300

sudo hardening (/etc/sudoers via visudo):
  Never edit /etc/sudoers directly — use visudo (validates syntax before saving)
  deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart myapp   # least privilege
  Defaults logfile=/var/log/sudo.log
  Defaults timestamp_timeout=5    # require password every 5 min

PAM (Pluggable Authentication Modules): controls auth for login, sudo, ssh
  /etc/pam.d/sshd, /etc/pam.d/sudo
  pam_faillock: lock account after N failed attempts
  pam_pwquality: enforce password complexity

SELinux (RHEL/Fedora): Mandatory Access Control
  getenforce           — Enforcing / Permissive / Disabled
  setenforce 0         — switch to permissive (debug mode)
  ausearch -m AVC -ts recent   — find recent denials
  audit2allow -a       — generate policy from denials

AppArmor (Debian/Ubuntu): profile-based MAC
  aa-status            — loaded profiles
  aa-complain /path/to/binary   — complain mode (log only)
  aa-enforce /path/to/binary    — enforce mode

Mount hardening (fstab options):
  noexec   — prevent execution of binaries on mount
  nosuid   — prevent SUID bit from taking effect
  nodev    — prevent device file creation
  /tmp: defaults,noexec,nosuid,nodev
    `.trim(),
        examples: [
            "# Audit all sudo usage\ngrep sudo /var/log/auth.log | tail -20\n# or with auditd\nauditctl -w /usr/bin/sudo -p x -k sudo_use",
            "# Check for world-writable files (security audit)\nfind / -xdev -perm -0002 -type f 2>/dev/null | grep -v /proc",
        ],
        commonMistakes: [
            "Using NOPASSWD: ALL in sudoers — always scope to specific commands only",
            "Disabling SELinux instead of writing a policy — permissive mode is fine for debugging, but don't leave it",
        ],
        relatedSlugs: ["permissions-acls", "systemd-units"],
    },
];

// Helper: get all unique categories
export const CATEGORIES = [...new Set(KNOWLEDGE_BASE.map((t) => t.category))];

// Helper: get chunk by slug
export function getChunkBySlug(slug: string): TopicSeed | undefined {
    return KNOWLEDGE_BASE.find((c) => c.slug === slug);
}

// Helper: get all chunks for a category
export function getChunksByCategory(category: string): TopicSeed[] {
    return KNOWLEDGE_BASE.filter((c) => c.category === category);
}
