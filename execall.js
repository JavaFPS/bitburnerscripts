/** @param {NS} ns */
import { deepScan } from 'deepScan.js';
export async function main(ns) {

      let serversScanned = await deepScan(ns);
      ns.kill('weakenall.js', 'home')
      for (let index in serversScanned) {
            const hostname = (serversScanned[index]);
            const thread = Math.floor(ns.getServerMaxRam(hostname) / ns.getScriptRam('weakenall.js'));
            if (ns.hasRootAccess(hostname)) {
                  if (ns.fileExists('weakenall.js', hostname)) {
                        ns.exec('weakenall.js', hostname, thread);
                        ns.tprint("Started weakenall.js on " + hostname);
                        await ns.sleep(200);
                  }
            }
      }
}
