/** @param {NS} ns */
export async function main(ns) {

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
