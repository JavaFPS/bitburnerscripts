/** @param {NS} ns */
import { deepScan } from 'deepScan.js';
export async function main(ns) {
      let serversScanned = await deepScan(ns);
      ns.kill('plague.js', 'home')
      for (let index in serversScanned) {
            const hostname = (serversScanned[index]);
            if (ns.hasRootAccess(hostname)) {
                  ns.killall(hostname);
                  ns.tprint("Killed all on " + hostname);
                  await ns.sleep(200);
            }
      }
}
