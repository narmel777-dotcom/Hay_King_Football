
const SOURCE = "https://www.fcbarcelona.com/en/transfer-market/";

const transfers = [  {
    name: "Brian Fariñas",
    wiki: "Brian_Fariñas",
    from: "La Masia",
    to: "Barcelona-ի առաջին թիմ",
    type: "Ակադեմիայից",
    dir: "academy",
    date: "01.09.2026"
  }
].map(player => ({ ...player, status: "official" }));
  { name: "Rodri", from: "Manchester City", to: "Barcelona", type: "Գնում", dir: "in", date: "18.08.2026" },
  { name: "João Cancelo", from: "Al Hilal", to: "Barcelona", type: "Գնում", dir: "in", date: "20.08.2026" },
  { name: "Gabriel Jesus", from: "Arsenal", to: "Barcelona", type: "Գնում", dir: "in", date: "01.09.2026" },
  { name: "Dominik Livaković", from: "Fenerbahçe", to: "Barcelona", type: "Գնում", dir: "in", date: "27.08.2026" },
  { name: "Karim Adeyemi", from: "Borussia Dortmund", to: "Barcelona", type: "Գնում", dir: "in", date: "23.07.2026" },
  { name: "Anthony Gordon", from: "Newcastle United", to: "Barcelona", type: "Գնում", dir: "in", date: "29.05.2026" },
  { name: "Jesse Bisiwu", from: "Նախորդ ակումբը նշված չէ", to: "Barcelona", type: "Գնում", dir: "in", date: "31.07.2026" },
  { name: "Ferran Torres", from: "Barcelona", to: "PSG", type: "Վաճառք", dir: "out", date: "15.08.2026" },
  { name: "Ronald Araújo", from: "Barcelona", to: "Liverpool", type: "Վարձակալություն", dir: "out", date: "10.08.2026" },
  { name: "Marc-André ter Stegen", from: "Barcelona", to: "Ajax", type: "Վարձակալություն", dir: "out", date: "04.08.2026" },
  { name: "Ansu Fati", from: "Barcelona", to: "AS Monaco", type: "Վաճառք", dir: "out", date: "30.06.2026" },
  { name: "Iñaki Peña", from: "Barcelona", to: "Panathinaikos", type: "Վաճառք", dir: "out", date: "23.06.2026" },
  { name: "Jofre Torrents", from: "Barcelona", to: "Ajax", type: "Վաճառք", dir: "out", date: "17.08.2026" },
  { name: "Tommy Marqués", from: "Barcelona", to: "SC Braga", type: "Վաճառք", dir: "out", date: "21.08.2026" },
  { name: "Héctor Fort", from: "Barcelona", to: "Real Sociedad", type: "Վաճառք", dir: "out", date: "29.08.2026" },
  { name: "Álvaro Cortés", from: "Barcelona", to: "Antwerp", type: "Վաճառք", dir: "out", date: "01.09.2026" },
  { name: "Toni Fernández", from: "Barcelona", to: "Venezia", type: "Վաճառք", dir: "out", date: "01.09.2026" },
  { name: "Marc Casadó", from: "Barcelona", to: "Deportivo A Coruña", type: "Վարձակալություն", dir: "out", date: "01.09.2026" },
  { name: "Xavi Espart", from: "Barcelona Atlètic", to: "Barcelona-ի առաջին թիմ", type: "Ակադեմիայից", dir: "academy", date: "27.08.2026" },
  { name: "Brian Fariñas", from: "La Masia", to: "Barcelona-ի առաջին թիմ", type: "Ակադեմիայից", dir: "academy", date: "01.09.2026" }
].map(p => ({ ...p, status: "official" }));

const search = document.getElementById("search");
const direction = document.getElementById("direction");
const type = document.getElementById("type");
const status = document.getElementById("status");
const club = document.getElementById("club");
const cards = document.getElementById("cards");
const resultCount = document.getElementById("resultCount");
const empty = document.getElementById("empty");

function render() {
  const query = search.value.trim().toLowerCase();

  const filtered = transfers.filter(p => {
    const text = `${p.name} ${p.from} ${p.to}`.toLowerCase();

    return text.includes(query) &&
      (direction.value === "all" || p.dir === direction.value) &&
      (type.value === "all" || p.type === type.value) &&
      (status.value === "all" || p.status === status.value) &&
      (club.value === "all" || p.from.includes(club.value) || p.to.includes(club.value));
  });

  resultCount.textContent = `Գտնվել է ${filtered.length} տեղափոխություն`;
  empty.style.display = filtered.length ? "none" : "block";

  cards.innerHTML = filtered.map(p => {
    const academy = p.dir === "academy";
    const initials = p.name.split(" ").map(s => s[0] || "").join("").slice(0, 3);

    return `
      <article class="card">
        <div class="photo">
          <div class="number">${initials}</div>
          <img
            src="https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(p.name.replaceAll(" ", "_"))}"
            alt="${p.name}"
            loading="lazy"
            data-player="${p.name}"
            onerror="this.style.display='none'"
          >
        </div>
        <div class="card-content">
          <h2>${p.name}</h2>
          <span class="badge ${academy ? "academy" : ""}">
            ✓ ${academy ? "Ակադեմիայից" : "Պաշտոնական"}
          </span>
          <div class="teams">
            <div class="team">${p.from}</div>
            <div class="arrow">→</div>
            <div class="team">${p.to}</div>
          </div>
          <div class="info">
            <b>Տեսակ՝</b> ${p.type}<br>
            <b>Ամսաթիվ՝</b> ${p.date}
          </div>
          <a class="source" href="${SOURCE}" target="_blank" rel="noopener">
            Պաշտոնական աղբյուր ↗
          </a>
        </div>
      </article>`;
  }).join("");

  cards.querySelectorAll("img").forEach(img => {
    const name = img.dataset.player.replaceAll(" ", "_");

    fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(name))
      .then(r => {
        if (!r.ok) throw new Error("Image unavailable");
        return r.json();
      })
      .then(data => {
        if (data.thumbnail?.source) {
          img.src = data.thumbnail.source;
        } else {
          img.style.display = "none";
        }
      })
      .catch(() => {
        img.style.display = "none";
      });
  });
}

[search, direction, type, status, club].forEach(el => {
  el.addEventListener("input", render);
  el.addEventListener("change", render);
});

document.getElementById("reset").addEventListener("click", () => {
  search.value = "";
  direction.value = "all";
  type.value = "all";
  status.value = "all";
  club.value = "all";
  render();
});

render();
