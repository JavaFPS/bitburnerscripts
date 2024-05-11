/** @param {NS} ns */
import { deepScan } from 'deepScan.js';
export async function main(ns) {
  let serversScanned = await deepScan(ns);
  ns.kill('weakenall.js', 'home')
  for (let index in serversScanned) {
    const hostname = (serversScanned[index]);
    if (ns.hasRootAccess(hostname)) {
      if (ns.fileExists('weakenall.js', hostname) || ns.fileExists('hostnames.js', hostname)) {
        ns.kill('weakenall.js', hostname);
        ns.rm('weakenall.js', hostname);
        ns.rm('hostnames.txt', hostname);
        await ns.sleep(200);
        ns.scp('weakenall.js', hostname);
        ns.scp('hostnames.txt', hostname);
        ns.tprint("updated - " + "weakenall.js & hostnames.txt on " + hostname);
      }
    }
  }
}
