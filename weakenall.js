/** @param {NS} ns */
export async function main(ns) {

      let serversScanned = await shuffle(await deepScan(ns));
      var hostnames = ns.read('hostnames.txt', 'utf8').split('\n').map(function (hostname) {
            hostname = hostname.replace(/['"]+/g, '').trim();
            return hostname; // Remove leading/trailing whitespace
      });
      while (true) {
            for (let index in serversScanned) {
                  const hostname = (serversScanned[index]);
                  if (hostnames.includes(hostname)) {
                        continue; // Skip this hostname
                  }
                  const hasRoot = ns.hasRootAccess(hostname);
                  if (hasRoot) {
                        if (ns.getServerSecurityLevel(hostname) > ns.getServerMinSecurityLevel(hostname) + 10) {
                              await ns.weaken(hostname)
                        }
                        else {
                              if (ns.getServerMoneyAvailable < ns.getServerMaxMoney) {
                                    await ns.grow(hostname)
                              }
                              else {
                                    if (ns.hackAnalyzeChance > 50) {
                                          await ns.hack(hostname)
                                    }
                              }
                        }
                  }
            }
            await ns.sleep(100)
      }
}




export async function deepScan(ns, data = [], serverName = 'home') {
      let serverlist = data;
      let scanlist = ns.scan(serverName);
      scanlist.forEach(scanned => {
            if (!serverlist.includes(scanned) && scanned != 'home') {
                  serverlist.push(scanned);
                  deepScan(ns, serverlist, scanned)
            }
      });
      return serverlist;
}
export async function shuffle(array) {
      let currentIndex = array.length;

      // While there remain elements to shuffle...
      while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                  array[randomIndex], array[currentIndex]];
      }
      return array
}
