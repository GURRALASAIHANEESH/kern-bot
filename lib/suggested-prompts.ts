export interface SuggestedPrompt {
    id: string;
    category: string;
    label: string;       // Short pill label shown in UI
    prompt: string;      // Full prompt sent to KERN
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
    // Shell
    {
        id: "sp-001",
        category: "Shell",
        label: "Find & kill port",
        prompt: "How do I find which process is using port 8080 and kill it cleanly?",
    },
    {
        id: "sp-002",
        category: "Shell",
        label: "Parse logs with awk",
        prompt: "Show me how to use awk to extract the 5th field from a space-delimited log file and sum numeric values",
    },
    {
        id: "sp-003",
        category: "Shell",
        label: "Safe bash script",
        prompt: "What does 'set -euo pipefail' do and why should every bash script start with it?",
    },
    {
        id: "sp-004",
        category: "Shell",
        label: "Batch rename files",
        prompt: "Write a bash script to rename all .log files older than 7 days to .log.bak in a directory recursively",
    },

    // Kernel
    {
        id: "sp-005",
        category: "Kernel",
        label: "Zombie processes",
        prompt: "What is a zombie process, why does it happen, and how do I get rid of one?",
    },
    {
        id: "sp-006",
        category: "Kernel",
        label: "OOM killer",
        prompt: "Explain how the Linux OOM killer decides which process to kill and how I can protect a critical process",
    },
    {
        id: "sp-007",
        category: "Kernel",
        label: "cgroups v2",
        prompt: "Explain cgroups v2 and how Docker uses them to enforce container memory limits",
    },

    // Networking
    {
        id: "sp-008",
        category: "Networking",
        label: "Debug connection",
        prompt: "A service isn't responding on port 5432. Walk me through systematically debugging the network connection on Linux",
    },
    {
        id: "sp-009",
        category: "Networking",
        label: "ss vs netstat",
        prompt: "What is the difference between ss and netstat, which flags do I actually use daily, and why should I switch?",
    },
    {
        id: "sp-010",
        category: "Networking",
        label: "iptables NAT",
        prompt: "How do I set up NAT masquerading with iptables to share internet from eth0 to an internal network on eth1?",
    },

    // Filesystem
    {
        id: "sp-011",
        category: "Filesystem",
        label: "Disk full debug",
        prompt: "My disk shows 100% usage but 'du -sh /*' doesn't account for it all. What is happening and how do I find what's consuming space?",
    },
    {
        id: "sp-012",
        category: "Filesystem",
        label: "SUID explained",
        prompt: "Explain the SUID bit with a real example, show me how to find all SUID binaries, and explain the security implications",
    },

    // SystemD
    {
        id: "sp-013",
        category: "SystemD",
        label: "Write a service",
        prompt: "Show me how to write a production-grade systemd service unit file for a Node.js application with proper restart, logging, and user configuration",
    },
    {
        id: "sp-014",
        category: "SystemD",
        label: "journalctl tips",
        prompt: "What are the most useful journalctl flags for debugging a service that keeps crashing?",
    },

    // Observability
    {
        id: "sp-015",
        category: "Observability",
        label: "strace a process",
        prompt: "How do I use strace to debug why a process is hanging? Walk me through reading the output.",
    },
    {
        id: "sp-016",
        category: "Observability",
        label: "Find disk leak",
        prompt: "A process deleted its log files but disk space wasn't freed. How do I find and fix this with lsof?",
    },
];

// Helpers
export function getPromptsByCategory(category: string): SuggestedPrompt[] {
    return SUGGESTED_PROMPTS.filter((p) => p.category === category);
}

export function getPromptById(id: string): SuggestedPrompt | undefined {
    return SUGGESTED_PROMPTS.find((p) => p.id === id);
}
