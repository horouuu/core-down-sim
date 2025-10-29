const fs = require("fs");
fetch(
  "https://raw.githubusercontent.com/DayV-git/osrsreboxed-db/master/docs/items-complete.json",
  {
    method: "GET",
    headers: { "User-Agent": "CDS - @godsel on Discord" },
  }
).then((res) => {
  if (res.ok) {
    res.json().then((data) => {
      const path =
        process.env.NODE_ENV === "production"
          ? "./build/scripts/item_data.json"
          : "./src/scripts/item_data.json";

      const finalData = Object.fromEntries(
        Object.entries(data).flatMap(([k, v]) => {
          if (!v.equipment) return [];
          const str = parseInt(v.equipment.melee_strength);
          if (str === 0 || isNaN(str)) return [];
          return [
            [
              k,
              {
                id: v.id,
                name: v.name,
                equipment: v.equipment,
              },
            ],
          ];
        })
      );

      fs.writeFileSync(path, JSON.stringify(finalData, null, 2), "utf8");
      console.log(
        `Successfully fetched data ${new Date().toLocaleTimeString()}`
      );
    });
  } else {
    console.log("Error fetching prices from wiki.");
  }
});
