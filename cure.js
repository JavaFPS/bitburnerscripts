/** @param {NS} ns */
import { deepScan } from 'deepScan.js';
export async function main(ns) {
  let serversScanned = await deepScan(ns);
  ns.kill('plague.js', 'home')
  for (let index in serversScanned) {
    const hostname = (serversScanned[index]);
    if (ns.hasRootAccess(hostname)) {
      if (ns.fileExists('plague.js', hostname) || ns.fileExists('hostnames.js', hostname)) {
        ns.kill('plague.js', hostname);
        ns.rm('plague.js', hostname);
        ns.rm('hostnames.txt', hostname);
        ns.tprint("Closed and Removed - " + "plague.js & hostnames.txt on " + hostname)
      }
    }
  }
}