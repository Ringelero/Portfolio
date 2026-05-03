/* Global Blob Guide Module */
(function(){
  const BLOB_STORAGE_KEY = "julius_global_blob_v1";

  function ready(fn){
    if(document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function(){
    let root = document.getElementById("blob-root");
    if(!root){
      root = document.createElement("div");
      root.id = "blob-root";
      document.body.appendChild(root);
    }

    root.innerHTML = `
      <div id="blob-hint">Blob antippen</div>
      <div id="blob-system">
        <div id="blob-chat">
          <p id="blob-text">Initialisiere kleine Existenzkrise…</p>
          <div id="blob-mood">Stimmung: bootet</div>
          <div id="blob-memory">Gedächtnis: wird geladen</div>
          <div class="blob-actions">
            <button id="blob-next" type="button">Weiter</button>
            <button id="blob-poet" class="secondary" type="button">Poetik</button>
            <button id="blob-help" class="secondary" type="button">Was ist hier?</button>
            <button id="blob-tour" class="secondary" type="button">Tour</button>
            <button id="blob-reset" class="secondary" type="button">Vergessen</button>
            <button id="blob-close" class="secondary" type="button">Ruhe</button>
          </div>
        </div>
        <button id="blob" aria-label="Blob Guide öffnen" type="button">
          <div id="blob-badge">?</div>
          <div class="blob-face">
            <div class="blob-eyes">
              <div class="blob-eye"></div>
              <div class="blob-eye"></div>
            </div>
            <div class="blob-mouth"></div>
          </div>
        </button>
      </div>
    `;

    const blob = document.getElementById("blob");
    const chat = document.getElementById("blob-chat");
    const text = document.getElementById("blob-text");
    const mood = document.getElementById("blob-mood");
    const memory = document.getElementById("blob-memory");
    const badge = document.getElementById("blob-badge");
    const hint = document.getElementById("blob-hint");

    let state;
    try{
      state = JSON.parse(localStorage.getItem(BLOB_STORAGE_KEY) || '{"visits":0,"clicks":0,"rooms":0,"poems":0,"lastSection":"intro","tour":0}');
    }catch(e){
      state = {visits:0,clicks:0,rooms:0,poems:0,lastSection:"intro",tour:0};
    }

    state.visits++;
    save();

    const messages = [
      ["Hey. Ich bin der Blob. Ich führe dich durch die Seite. Widerwillig, aber dekorativ.","freundlich fatalistisch",""],
      ["Ich merke mir Dinge lokal im Browser. Kein Konzern. Nur ich. Viel schlimmer.","lokal allwissend","chaos"],
      ["Du bist zum " + state.visits + ". Mal hier. Das ist entweder Interesse oder ein Hilferuf.","beobachtend","sad"],
      ["Wenn etwas nicht funktioniert, nennen wir es Prototyp. Scheitern mit besserem Branding.","professionell fragwürdig","chaos"],
      ["Ich begleite dich. Nicht, weil ich muss. Obwohl… technisch gesehen schon.","pflichtbewusst traurig",""]
    ];

    const poems = [
      ["Die Hoffnung ist ein kleines Licht. Praktisch, wenn man den Sicherungskasten sucht.","melancholisch nützlich",""],
      ["Auch der schönste Morgen ist nur ein Abend mit besserem Marketing.","sonnig vernichtet","sad"],
      ["Ich lächle, weil das Interface es verlangt. Innerlich lade ich noch.","digital erschöpft",""],
      ["Alles fließt. Besonders Kaffee auf weißen T-Shirts.","alltagsphilosophisch","chaos"],
      ["Der Mensch plant, der Blob seufzt, die Gardine fährt trotzdem.","fatalistisch produktiv",""]
    ];

    let messageIndex = 0;
    let poemIndex = 0;
    let tourStep = 0;

    function save(){
      localStorage.setItem(BLOB_STORAGE_KEY, JSON.stringify(state));
    }

    function updateMemory(){
      badge.textContent = state.visits > 9 ? "9+" : state.visits;
      memory.textContent = "Gedächtnis: " + state.visits + " Besuch(e), " + state.clicks + " Klicks, " + state.rooms + " Raumaktionen";
    }

    function setMessage(entry){
      text.textContent = entry[0];
      mood.textContent = "Stimmung: " + entry[1];
      blob.classList.remove("sad","chaos","excited");
      if(entry[2]) blob.classList.add(entry[2]);
      updateMemory();
    }

    function openChat(){
      chat.classList.add("open");
      if(hint) hint.style.display = "none";
    }

    function emote(){
      blob.classList.add("excited");
      setTimeout(() => blob.classList.remove("excited"), 600);
      burst();
    }

    function burst(){
      const rect = blob.getBoundingClientRect();
      const emojis = ["💎","✨","♦️","💠"];
      for(let j=0; j<8; j++){
        const part = document.createElement("div");
        part.className = "blob-particle";
        part.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        part.style.left = (rect.left + rect.width / 2) + "px";
        part.style.top = (rect.top + rect.height / 2) + "px";
        part.style.setProperty("--x", (Math.random() * 140 - 70) + "px");
        part.style.setProperty("--y", (Math.random() * -120 - 20) + "px");
        document.body.appendChild(part);
        setTimeout(() => part.remove(), 900);
      }
    }

    function currentSection(){
      const sections = [...document.querySelectorAll("[data-blob], section, main")];
      if(!sections.length) return null;
      let best = sections[0];
      let score = Infinity;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const value = Math.abs(rect.top - window.innerHeight * 0.25);
        if(value < score){
          score = value;
          best = section;
        }
      });

      return best;
    }

    function speakHere(){
      const section = currentSection();
      const fallback = "Hier ist ein Bereich. Vermutlich wichtig. Websites sind Labyrinthe mit besserer Typografie.";
      text.textContent = section?.dataset?.blob || fallback;
      mood.textContent = "Stimmung: ortskundig, aber müde";
      if(section?.id) state.lastSection = section.id;
      save();
      updateMemory();
      openChat();
    }

    function getTourTargets(){
      const byData = [...document.querySelectorAll("[data-blob][id]")].map(el => el.id);
      if(byData.length) return byData;
      return [...document.querySelectorAll("section[id]")].map(el => el.id);
    }

    function tour(){
      const targets = getTourTargets();
      if(!targets.length){
        setMessage(["Ich würde dich herumführen, aber diese Seite hat keine Wegweiser. Mutig.","navigationstraurig","sad"]);
        openChat();
        return;
      }

      const id = targets[tourStep % targets.length];
      tourStep++;
      state.tour++;
      save();

      document.getElementById(id).scrollIntoView({behavior:"smooth"});
      setTimeout(() => {
        speakHere();
        text.textContent += " Tourservice inklusive. Trinkgeld akzeptiere ich in Aufmerksamkeit.";
      }, 450);
    }

    blob.addEventListener("click", () => {
      state.clicks++;
      save();
      updateMemory();
      chat.classList.toggle("open");
      if(hint) hint.style.display = "none";

      if(state.clicks === 5){
        setMessage(["Fünf Klicks. Du bist entweder neugierig oder das Interface ist zu rund.","diagnostisch","chaos"]);
        openChat();
      }

      if(state.clicks === 12){
        setMessage(["Zwölf Klicks. Ich beginne, dich zu respektieren. Widerwillig.","beeindruckt verstört",""]);
        openChat();
      }
    });

    document.getElementById("blob-next").addEventListener("click", () => {
      messageIndex = (messageIndex + 1) % messages.length;
      setMessage(messages[messageIndex]);
      emote();
      openChat();
    });

    document.getElementById("blob-poet").addEventListener("click", () => {
      poemIndex = (poemIndex + 1) % poems.length;
      state.poems++;
      save();
      setMessage(poems[poemIndex]);
      emote();
      openChat();
    });

    document.getElementById("blob-help").addEventListener("click", speakHere);
    document.getElementById("blob-tour").addEventListener("click", tour);
    document.getElementById("blob-close").addEventListener("click", () => chat.classList.remove("open"));

    document.getElementById("blob-reset").addEventListener("click", () => {
      localStorage.removeItem(BLOB_STORAGE_KEY);
      text.textContent = "Ich vergesse alles. Beneidenswert.";
      mood.textContent = "Stimmung: gelöschte Vergangenheit";
      memory.textContent = "Gedächtnis: leer. Wie ein Montag.";
      state = {visits:0,clicks:0,rooms:0,poems:0,lastSection:"intro",tour:0};
      badge.textContent = "0";
      emote();
      openChat();
    });

    setInterval(() => {
      blob.classList.add("blink");
      setTimeout(() => blob.classList.remove("blink"), 150);
    }, 3600);

    let idleTimer;
    function resetIdle(){
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        text.textContent = "Du bist still. Das ist okay. Viele große Katastrophen begannen mit Nachdenken.";
        mood.textContent = "Stimmung: lauschend";
        openChat();
      }, 22000);
    }

    ["click","touchstart","scroll","mousemove"].forEach(eventName => {
      document.addEventListener(eventName, resetIdle, {passive:true});
    });
    resetIdle();

    document.addEventListener("mousemove", event => {
      document.querySelectorAll(".blob-eye").forEach(eye => {
        const rect = eye.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        eye.style.transform = "translate(" + Math.max(-3, Math.min(3, dx * 0.025)) + "px," + Math.max(-3, Math.min(3, dy * 0.025)) + "px)";
      });
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting && entry.intersectionRatio > 0.58){
          const section = entry.target;
          if(section.id) state.lastSection = section.id;
          save();
          text.textContent = section.dataset.blob || "Neuer Bereich. Ich tu so, als wäre das geplant.";
          mood.textContent = "Stimmung: kontextsensitiv";
          updateMemory();
        }
      });
    }, {threshold:[0.58]});

    document.querySelectorAll("[data-blob]").forEach(section => observer.observe(section));

    document.querySelectorAll(".room").forEach(room => {
      room.addEventListener("click", () => {
        state.rooms++;
        state.clicks++;
        save();

        room.classList.toggle("active");
        const label = room.querySelector("strong")?.textContent || "Element";
        const status = room.querySelector(".status");

        if(status){
          if(label.includes("Gardinen")) status.textContent = room.classList.contains("active") ? "offen" : "geschlossen";
          else if(label.includes("Sensorik")) status.textContent = room.classList.contains("active") ? "online" : "offline";
          else status.textContent = room.classList.contains("active") ? "aktiv" : "aus";
        }

        text.textContent = label + " geändert. Gewaltfreie Kommunikation mit Elektronen. Schön.";
        mood.textContent = "Stimmung: technisch zufrieden";
        openChat();
        emote();
        updateMemory();
      });
    });

    if(state.visits === 1){
      setMessage(["Erster Besuch. Willkommen. Ich habe keine Hände, aber ich halte metaphorisch die Tür auf.","zeremoniell erschöpft",""]);
    }else{
      setMessage(["Willkommen zurück. Ich habe dich wiedererkannt. Gruselig, aber lokal gespeichert.","wiedererkennend",""]);
    }

    setTimeout(() => {
      openChat();
      emote();
    }, 850);
  });
})();
