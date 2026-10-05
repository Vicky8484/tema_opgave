# Refleksion – Figma til kode

**Gruppemedlemmer:**

- Julie Mørk
- Victory Okosun

## Sådan bruger I filen

Skriv jeres fælles refleksion direkte i denne fil. Erstat hjælpeteksterne med jeres egne erfaringer, og slet Markdown-guiden og demoen inden aflevering. Skriv kort og konkret, og brug eksempler fra jeres egen kode.

Åbn forhåndsvisningen i VS Code med **Cmd + Shift + V** (Mac) eller **Ctrl + Shift + V** (Windows). Så ser I, hvordan Markdown bliver vist. På GitHub vises formateringen automatisk, når I åbner filen.

### Mini-guide til Markdown

- `# Titel` er dokumentets hovedoverskrift. Brug kun én.
- `## Afsnit` og `### Underafsnit` giver overskrifter i flere niveauer.
- `**vigtig tekst**` bliver til **vigtig tekst**.
- En bindestreg efterfulgt af et mellemrum laver en punktopstilling som denne.
- Skriv kode inde i en sætning mellem enkelte backticks, fx `getTeamMembers()`.
- Links skrives sådan: `[Astros dokumentation](https://docs.astro.build/)`.
- Lav et nyt afsnit med en tom linje. Brug også en tom linje før og efter lister og kodeblokke.

## Robusthed og tilgængelighed (Fallback/progressive enhancement (@supports))

### Scrollbar

I `src/components/ScrollSection.astro` lavede vi en custom scrollbar med `::-webkit-scrollbar`, fordi vi ikke ville have default scrollbaren. Vi fandt ud af at dette ikke er kompatibelt med fx Firefox. Så vi brugte `@supports` og `@supports not` til at erstatte vores custom scrollbar med default scrollbarer i browsere der ikke understøtter det. Vi kunne godt have nøjes med `@supports not`, men brugte bare begge dele.

```css
@supports selector(::-webkit-scrollbar) {
  .scroll {
    &::-webkit-scrollbar {
      height: 10px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-ui-primary);
      border-radius: var(--roundedSmall);
    }
  }
}

@supports not selector(::-webkit-scrollbar) {
  .scroll {
    /* Fallback til browsere uden WebKit-scrollbar-selectoren */
    scrollbar-width: 10px;
    scrollbar-color: var(--color-ui-primary) transparent;
  }
}
```

Teknikken passer til problemet, fordi vi skulle have vores custom scrollbar i browsere, hvor det virker, men stadig ville style på default scrollbaren i browsere, hvor den bliver vist i stedet. Vi testede scroll sektionen i Chrome, Firefox og Edge, og vores custom scrollbar vises som den skal på Chrome og Edge, men på Firefox vises dens default scrollbar, men i den farve vi har valgt.

## Ekstra benspænd/forbedringer

### Scroll-driven eller scroll-triggered animation.

```css
figure {
  flex: 0 1 200px;
  min-inline-size: 0;
  text-align: center;

  --value: attr(data-value type(<number>));
  --value-string: attr(data-value);
  --value-percent: attr(data-value %);

  container: circle/inline-size;
  display: grid;
  grid: "stack";
  place-items: center;

  /* Animation trigger conditions */
  timeline-trigger: --trigger view() entry 100% exit 2%;

  /* Animation trigger settings */
  animation-trigger: --trigger play-forwards play-backwards;
}
```

Vi brugte scroll driven animations på `src/components/Doughnutchart.astro`, som ses foroven.

Vi har valgt at bruge scroll-driven animation her, da det gør at animationer kan ses på siden lige meget om du er kommet til at scrolle forbi den for hurtigt eller hvis du har brugt for lang tid i toppen, den gør så du kan se animationen hver gang du kommer forbi, så du også får den oplevelse af at siden har noget bevægelse.

Vi testede det af, og det virkede ikke i Firefox, så i stedet har vi der kun tallene der står, hvilket stadig er relevant data for de besøgende på hjemmesiden. Animationen kører stadig på tallene, hvis man er i den view-width.

Da der på Firefox stadig var den røde markør, men ikke hele den anden animation, valgte vi at fjerne prikken, da den kun ville forvirre for brugeren.

### Relative Color Syntax, fx til hover-, active- eller disabled-states.

I `src/components/Button.astro` bruger vi relative color til at styre hover- og active states på knapper og links. Vi startede med at ændre vores farver i tokens.css fra hex-koder til oklch værdier, fordi det er dem vi har lavet relative color øvelser med. Vores buttons bruger data-attributter til at bestemme, hvilken styling de skal have. Vi har defineret hover-, active- og focus-states med, hvor –color-accent’s lightness værdi ændre sig.

```css
a,
button {
  --color-accent-hover: oklch(from var(--color-accent) calc(l + 0.09) c h);
  --color-accent-active: oklch(from var(--color-accent) calc(l + 0.2) c h);
  --color-accent-focus: oklch(from var(--color-accent) calc(l - 0.9) c h);

  --color-accent-hover-white: oklch(from var(--color-accent) calc(l - 0.2) c h);
  --color-accent-active-white: oklch(
    from var(--color-accent) calc(l - 0.4) c h
  );
  --color-accent-focus-white: oklch(from var(--color-accent) calc(l - 0.9) c h);
}

[data-variant="accent"] {
  --color-accent: var(--color-action);
  color: contrast-color(var(--color-action));
  background: var(--color-accent);

  &:hover {
    background: var(--color-accent-hover);
  }

  &:active {
    background: var(--color-accent-active);
  }
}
```

Til hvert data-attribut har vi givet –color-accent den passende farve, så den ændrer sig. Vi har også lavet “reverse” hover-, active- og focus-states til de hvide knapper, hvor lightness bliver nedsat i stedet for øget.

## Defensive CSS

Vi har brugt

```css
svg {
  color: var(--accent);
  flex-shrink: 0;
}
```

flex-shrink: 0; til 0 så ikonerne ikke bliver mast når teksten bliver lang, dette gør også at hvis kunden havde brug for at ændre teksten til noget andet ville det ikke påvirker ikonernes størrelse.

Vi har brugt

```css
img {
  border-radius: 15px;
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
```

object-fit: cover; på billederne i `src/components/Whattoexpectbox.astro` og på vores `src/pages/team/[slug].astro`, hvilket gør at billederne bliver beskåret i stedet for at blive strakt, hvis proportioner ikke passer.

## tokens.css/global.css/komponent CSS

Alt (eller det meste af) hvad der er generelt og gælder alle steder, kan findes i vores global.css. Dvs. font for headings, størrelser og grid på body som alt skal flugte med. Her er også CSS-regler for vores mobil menu, som er en burger slide-out menu.

I vores komponenters scoped styles skrev vi alle de regler som kun var gældende for den pågældende komponent fx størrelser, spacing, border-radius, container queries, farver osv.

I vores token.css hentede vi alle genbrugelige værdier fx flydende fontstørrelser, flydende spacing-værdier, flydende border-radius-værdier og farver. Vi brugte både tokens i global.css (primært fontstørrelser) og komponent CSS (alt muligt andet).

## Fejl

Da vi først havde sat vores sider op havde vi ikke tilføjet main til full-bleed reglen i vores globale css. Det skabte en del problemer i forhold til at få full-bleed til at virke. Da vi fik det tilføjet, var der mange ting der faldt på plads i grid'et.

Udover det havde vi også på siden `src/pages/case-studies/[slug].astro`, glemt overhovdet at tilføje en main så det blev slet ikke påvirket af at vi havde tilføjet den i det globale css, det var noget som AI var med til at debugge.

## Brug af AI

### Et konkret eksemple med AI brug:

Julies prompts
Hvorfor .full-bleed ikke virkede på TitleHero.
Hvorfor FAQ'en ikke kom ind i content-kolonnen, når DevTools sagde: "The display: block property on the parent element prevents grid-column from having an effect".
Hvor i global.css jeg skulle tilføje main, så den blev en del af griddet.

Hvad AI'en forklarede
Den globale regel er body > .full-bleed. > betyder direkte barn, så den virker kun på elementer, der ligger direkte i <body>.
grid-column virker kun på børn af et grid. <main> og <article> var almindelige block-elementer, så kæden af grids var brudt, og elementerne indeni kunne ikke "se" full-start, content og så videre.
Der var to løsninger:
Flytte komponenten ud af <main>, så den bliver et direkte barn af body.
Gøre <main> til en del af griddet ved at tilføje main til selector-listen header, footer, .full-bleed i global.css. Så bliver main et subgrid af body, og dens børn placeres automatisk i content
Efter dette snakkede vi sammen i gruppen og blev enige om at tilføje main til slug siden og til selector listen.

Ellers har vi haft meget sparring med AI undervejs (Julie har brugt Claude og Victory har brugt VSCode Copilot eller DevTools AI Assistence). Vi har promptet den til at være forklarende og bruge det vi har lært fremfor bare at spytte løsninger ud eller ændre i filer.

Vi har især brugt AI-sparring til git-problemer (styles der ikke er fulgt med, git konflikter osv), grid konflikter (ting der ikke flugter med body’s grid som det skal eller skal have deres eget grid osv). Til andre on-off problemer har vi begge haft en oplevelse af at være midt i at prompte AI og så tænke “det kan jeg faktisk godt selv”. Ellers har vi brugt det som en sidste udvej til at komme videre.
