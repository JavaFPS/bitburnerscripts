/** @param {NS} ns */




export async function main(ns) {
      const me = ns.getHostname();
      let serversScanned = await shuffle(await deepScan(ns));
      let startMyhacklvl = ns.getHackingLevel();
      var hostnames = ns.read('hostnames.txt', 'utf8').split('\n').map(function (hostname) {
            hostname = hostname.replace(/['"]+/g, '').trim();
            return hostname; // Remove leading/trailing whitespace
      });


      for (let index in serversScanned) {
            const hostname = (serversScanned[index]);

            // Check if the current hostname is in the list
            if (hostnames.includes(hostname)) {
                  ns.print("Skipping " + hostname + " (Hostname)");
                  continue; // Skip this hostname
            }
            if (ns.fileExists('plague.js', hostname)) { continue; }

            const targetHackingLevel = ns.getServerRequiredHackingLevel(hostname);

            if (startMyhacklvl > targetHackingLevel) {
                  const serverMaxMoney = ns.getServerMaxMoney(hostname);
                  const serverCurrentMoney = ns.getServerMoneyAvailable(hostname);
                  const servermaxRam = ns.getServerMaxRam(hostname);
                  const hasRoot = ns.hasRootAccess(hostname);

                  if (servermaxRam == 0) { continue; }
                  if (serverMaxMoney == 0) { ns.tprint("Investigate - " + hostname + " || RAM - " + servermaxRam + "GB"); continue; }


                  if (hasRoot) { // CHECKS FOR ROOT
                        const availableRam = servermaxRam - ns.getServerUsedRam(hostname);
                        const thread = Math.floor(availableRam / ns.getScriptRam('plague.js'));
                        if (ns.fileExists('plague.js', hostname)) {
                              ns.print(hostname + ' already has the plague.');
                              continue;
                        }
                        ns.tprint("-------------------------------------------------------");
                        if (!ns.fileExists('plague.js', hostname)) {
                              if (servermaxRam > ns.getScriptRam('plague.js')) {
                                    ns.tprint(hostname + " caught the plague from " + ns.getHostname())
                                    ns.tprint("-------------------------------------------------------");
                                    ns.scp('hostnames.txt', hostname)
                                    ns.scp('plague.js', hostname)
                                    ns.exec('plague.js', hostname, thread)
                              }
                              else { ns.tprint("Not enough ram to run on " + hostname) }
                        }

                        ns.tprint(hostname + " - Vulnerable");
                        ns.tprint("Can run with " + thread + " threads")
                        if (ns.fileExists('plague.js', hostname)) {
                              ns.tprint(((((servermaxRam - ns.getServerUsedRam(hostname))) + ns.getScriptRam('plague.js')).toFixed(2)) + "GB" + " Available Ram")
                        }
                        else {
                              ns.tprint(((servermaxRam - ns.getServerUsedRam(hostname))) + "GB" + " Available Ram")
                        }
                        if ((((Math.floor(serverCurrentMoney)) / Math.floor(serverMaxMoney)) * 100) > 20) {
                              ns.tprint(hostname + " - Worth It  |||  " + Math.floor(serverCurrentMoney) + " / " + Math.floor(serverMaxMoney) + " " + (((Math.floor(serverCurrentMoney)) / Math.floor(serverMaxMoney)) * 100).toFixed(1) + "%");
                              ns.tprint("Hacking - " + hostname)
                              while ((((Math.floor(serverCurrentMoney)) / serverMaxMoney) * 100) > 20) {
                                    await ns.hack(hostname);
                              }
                        }
                        else {
                              ns.tprint(hostname + " - Not Worth  |||  " + Math.floor((Math.floor(serverCurrentMoney) / Math.floor(serverMaxMoney)) * 100) + "%")
                              ns.tprint(serverCurrentMoney.toFixed(2) + " / " + serverMaxMoney)
                              while (((serverCurrentMoney / serverMaxMoney) * 100) < 20) {
                                    await ns.grow(hostname);
                              }
                        }

                  }

                  else { //ATTEMPTS  ROOT IF IT  DOES NOT HAVE

                        if (isitHackable(ns, startMyhacklvl, targetHackingLevel)) {
                              await getRoot(ns, hostname) //GETS ROOT
                              if (ns.hasRootAccess(hostname)) { //CHECKS IF SUCCESSFUL 
                                    ns.tprint("Got Root - " + hostname)
                              }
                              else { //IF NOT SUCCESSFUL
                                    ns.print("Could not get root - " + hostname)
                              }
                        }

                        else { ns.print("No Root & Not Hackable - " + hostname) }
                  }

            }

      }
}









//async function

async function isitHackable(ns, myhacklvl, targetHackingLevel) {
      let hackable = 'N'
      if (myhacklvl > targetHackingLevel) {
            hackable = 'Y'
            return hackable;
      }
      else if (targetHackingLevel > myhacklvl) {
            hackable = 'N';
            return hackable;
      }
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

export async function getRoot(ns, hostname) {
      if (!hostname == 'home' || hostname == 'silo' || hostname == 'CSEC' || hostname == "darkweb") {
            return;
      }
      else {
            await ns.brutessh(hostname);
            //await ns.sqlinject(hostname);
            await ns.relaysmtp(hostname);
            await ns.httpworm(hostname);
            await ns.ftpcrack(hostname);
            await ns.nuke(hostname);
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
