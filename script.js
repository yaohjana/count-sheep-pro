class SheepCounter {
  constructor() {
    this.count = 0;
    this.isRunning = false;

    this.speedMs = 2000;
    this.useVoice = true;
    this.voiceLang = "zh-TW";
    this.uiLang = "zh-TW";
    this.sheepType = "classic";

    this.fadeOutEnabled = true;
    this.fadeOutDurationSec = 1800;
    this.sessionElapsedMs = 0;

    this.settingsOpen = false;

    this.loopTimer = null;
    this.lastLoopAt = 0;
    this.accumulatorMs = 0;
    this.pendingCycles = 0;
    this.cycleInProgress = false;
    this.cycleToken = 0;

    this.synth = window.speechSynthesis || null;
    this.voices = [];

    this.translations = {
      "zh-TW": {
        title: "數綿羊",
        subtitle: "用穩定節奏數綿羊，幫助放鬆入睡",
        countLabel: "隻綿羊",
        start: "開始",
        pause: "暫停",
        reset: "重設",
        hint: "提示：開啟語音後可搭配漸弱，讓朗讀音量逐步下降。",
        uiLangLabel: "介面語言",
        sheepTypeLabel: "綿羊種類",
        speedLabel: "每隻間隔（秒）",
        voiceToggleLabel: "語音朗讀",
        voiceLangLabel: "語音語言",
        fadeOutToggleLabel: "啟用漸弱",
        fadeDurationLabel: "時長",
        secondsSuffix: "秒",
        openSettings: "開啟設定",
        closeSettings: "關閉設定",
        fadeButtonLabels: {
          30: "30秒",
          60: "1分",
          180: "3分",
          600: "10分",
          1800: "30分",
          3600: "1小時"
        },
        sheepOptions: {
          classic: "經典（交替）",
          lamb: "白綿羊",
          ram: "公羊",
          duo: "雙羊",
        },
      },
      "zh-CN": {
        title: "\u6570\u7EF5\u7F8A",
        subtitle: "\u7528\u7A33\u5B9A\u8282\u594F\u6570\u7EF5\u7F8A\uFF0C\u5E2E\u52A9\u653E\u677E\u5165\u7761",
        countLabel: "\u53EA\u7EF5\u7F8A",
        start: "\u5F00\u59CB",
        pause: "\u6682\u505C",
        reset: "\u91CD\u7F6E",
        hint: "\u63D0\u793A\uFF1A\u5F00\u542F\u8BED\u97F3\u540E\u53EF\u642D\u914D\u6E10\u5F31\uFF0C\u8BA9\u6717\u8BFB\u97F3\u91CF\u9010\u6B65\u4E0B\u964D\u3002",
        uiLangLabel: "\u754C\u9762\u8BED\u8A00",
        sheepTypeLabel: "\u7EF5\u7F8A\u79CD\u7C7B",
        speedLabel: "\u6BCF\u53EA\u95F4\u9694\uFF08\u79D2\uFF09",
        voiceToggleLabel: "\u8BED\u97F3\u6717\u8BFB",
        voiceLangLabel: "\u8BED\u97F3\u8BED\u8A00",
        fadeOutToggleLabel: "\u542F\u7528\u6E10\u5F31",
        fadeDurationLabel: "\u65F6\u957F",
        secondsSuffix: "\u79D2",
        openSettings: "\u6253\u5F00\u8BBE\u7F6E",
        closeSettings: "\u5173\u95ED\u8BBE\u7F6E",
        fadeButtonLabels: {
          30: "30\u79D2",
          60: "1\u5206",
          180: "3\u5206",
          600: "10\u5206",
          1800: "30\u5206",
          3600: "1\u5C0F\u6642"
        },
        sheepOptions: {
          classic: "\u7ECF\u5178\uFF08\u4EA4\u66FF\uFF09",
          lamb: "\u767D\u7EF5\u7F8A",
          ram: "\u516C\u7F8A",
          duo: "\u53CC\u7F8A",
        },
      },
      en: {
        title: "Count Sheep",
        subtitle: "Count sheep at a steady rhythm to relax and drift to sleep",
        countLabel: "sheep",
        start: "Start",
        pause: "Pause",
        reset: "Reset",
        hint: "Tip: Pair voice narration with fade-out so volume decreases over time.",
        uiLangLabel: "Interface language",
        sheepTypeLabel: "Sheep type",
        speedLabel: "Seconds per sheep",
        voiceToggleLabel: "Voice narration",
        voiceLangLabel: "Voice language",
        fadeOutToggleLabel: "Enable fade-out",
        fadeDurationLabel: "Duration",
        secondsSuffix: "sec",
        openSettings: "Open settings",
        closeSettings: "Close settings",
        fadeButtonLabels: {
          30: "30s",
          60: "1m",
          180: "3m",
          600: "10m",
          1800: "30m",
          3600: "1h",
        },
        sheepOptions: {
          classic: "Classic (alternate)",
          lamb: "Lamb",
          ram: "Ram",
          duo: "Twin sheep"
        },
      },
      ja: {
        title: "\u7F8A\u3092\u6570\u3048\u308B",
        subtitle: "\u4E00\u5B9A\u306E\u30EA\u30BA\u30E0\u3067\u7F8A\u3092\u6570\u3048\u3066\u3001\u3086\u3063\u304F\u308A\u7720\u308A\u3078",
        countLabel: "\u5339\u306E\u7F8A",
        start: "\u958B\u59CB",
        pause: "\u4E00\u6642\u505C\u6B62",
        reset: "\u30EA\u30BB\u30C3\u30C8",
        hint: "\u30D2\u30F3\u30C8: \u97F3\u58F0\u8AAD\u307F\u4E0A\u3052\u3068\u30D5\u30A7\u30FC\u30C9\u30A2\u30A6\u30C8\u3092\u7D44\u307F\u5408\u308F\u305B\u308B\u3068\u3001\u5F90\u3005\u306B\u97F3\u91CF\u304C\u4E0B\u304C\u308A\u307E\u3059\u3002",
        uiLangLabel: "\u8868\u793A\u8A00\u8A9E",
        sheepTypeLabel: "\u7F8A\u306E\u7A2E\u985E",
        speedLabel: "1\u5339\u3054\u3068\u306E\u9593\u9694\uFF08\u79D2\uFF09",
        voiceToggleLabel: "\u97F3\u58F0\u8AAD\u307F\u4E0A\u3052",
        voiceLangLabel: "\u97F3\u58F0\u8A00\u8A9E",
        fadeOutToggleLabel: "\u30D5\u30A7\u30FC\u30C9\u30A2\u30A6\u30C8\u3092\u6709\u52B9\u5316",
        fadeDurationLabel: "\u6642\u9593",
        secondsSuffix: "\u79D2",
        openSettings: "\u8A2D\u5B9A\u3092\u958B\u304F",
        closeSettings: "\u8A2D\u5B9A\u3092\u9589\u3058\u308B",
        fadeButtonLabels: {
          30: "30\u79D2",
          60: "1\u5206",
          180: "3\u5206",
          600: "10\u5206",
          1800: "30\u5206",
          3600: "1\u6642\u9593"
        },
        sheepOptions: {
          classic: "\u30AF\u30E9\u30B7\u30C3\u30AF\uFF08\u4EA4\u4E92\uFF09",
          lamb: "\u767D\u3044\u7F8A",
          ram: "\u96C4\u7F8A",
          duo: "2\u5339",
        },
      },
    };

    this.cacheDom();
    this.init();
    this.exposeTestHooks();
  }

  cacheDom() {
    this.countDisplay = document.getElementById("count");
    this.countLabel = document.getElementById("countLabel");
    this.sheepEl = document.getElementById("sheep");

    this.titleText = document.getElementById("titleText");
    this.subtitleText = document.getElementById("subtitleText");
    this.hintText = document.getElementById("hintText");

    this.startBtn = document.getElementById("startBtn");
    this.pauseBtn = document.getElementById("pauseBtn");
    this.resetBtn = document.getElementById("resetBtn");

    this.settingsToggle = document.getElementById("settingsToggle");
    this.settingsCard = document.getElementById("settingsCard");

    this.uiLangLabel = document.getElementById("uiLangLabel");
    this.uiLangSelect = document.getElementById("uiLangSelect");

    this.sheepTypeLabel = document.getElementById("sheepTypeLabel");
    this.sheepTypeSelect = document.getElementById("sheepTypeSelect");

    this.speedLabel = document.getElementById("speedLabel");
    this.speedRange = document.getElementById("speedRange");
    this.speedValue = document.getElementById("speedValue");

    this.voiceToggleLabel = document.getElementById("voiceToggleLabel");
    this.voiceToggle = document.getElementById("voiceToggle");

    this.voiceLangLabel = document.getElementById("voiceLangLabel");
    this.voiceSelect = document.getElementById("voiceSelect");

    this.fadeOutToggleLabel = document.getElementById("fadeOutToggleLabel");
    this.fadeDurationLabel = document.getElementById("fadeDurationLabel");
    this.fadeOutToggle = document.getElementById("fadeOutToggle");
    this.fadeOutInput = document.getElementById("fadeOutInput");
    this.secondsSuffix = document.getElementById("secondsSuffix");
    this.fadePresetButtons = Array.from(document.querySelectorAll(".fade-btn"));
  }

  init() {
    this.restoreSettings();
    this.applyTranslations();
    this.bindEvents();
    this.loadVoices();

    if (this.synth && typeof this.synth.onvoiceschanged !== "undefined") {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }

    this.render();
    this.setSheepState("is-out");
  }

  bindEvents() {
    this.startBtn.addEventListener("click", () => this.start());
    this.pauseBtn.addEventListener("click", () => this.pause());
    this.resetBtn.addEventListener("click", () => this.reset());

    this.settingsToggle.addEventListener("click", () => this.toggleSettings());

    document.addEventListener("click", (event) => {
      if (!this.settingsOpen) return;
      const target = event.target;
      if (target instanceof Node && !this.settingsCard.contains(target) && !this.settingsToggle.contains(target)) {
        this.toggleSettings(false);
      }
    });

    this.uiLangSelect.addEventListener("change", (event) => {
      this.uiLang = event.target.value;
      this.applyTranslations();
      this.persistSettings();
      this.render();
    });

    this.sheepTypeSelect.addEventListener("change", (event) => {
      this.sheepType = event.target.value;
      this.persistSettings();
      this.render();
    });

    this.speedRange.addEventListener("input", (event) => {
      this.speedMs = Number(event.target.value) * 1000;
      this.speedValue.textContent = Number(event.target.value).toFixed(1);
      this.persistSettings();
    });

    this.voiceToggle.addEventListener("change", (event) => {
      this.useVoice = Boolean(event.target.checked);
      this.persistSettings();
      if (!this.useVoice && this.synth?.speaking) {
        this.synth.cancel();
      }
    });

    this.voiceSelect.addEventListener("change", (event) => {
      this.voiceLang = event.target.value;
      this.persistSettings();
    });

    this.fadeOutToggle.addEventListener("change", (event) => {
      this.fadeOutEnabled = Boolean(event.target.checked);
      this.persistSettings();
    });

    this.fadeOutInput.addEventListener("input", (event) => {
      const safeValue = this.clamp(Number(event.target.value), 1, 3600);
      this.fadeOutDurationSec = safeValue;
      this.fadeOutInput.value = String(safeValue);
      this.persistSettings();
    });

    for (const button of this.fadePresetButtons) {
      button.addEventListener("click", () => {
        const seconds = Number(button.dataset.seconds);
        this.fadeOutDurationSec = this.clamp(seconds, 1, 3600);
        this.fadeOutInput.value = String(this.fadeOutDurationSec);
        this.persistSettings();
      });
    }
  }

  detectLocaleLanguage() {
    const rawList = [navigator.language, ...(navigator.languages || [])].filter(Boolean);

    for (const entry of rawList) {
      const lower = String(entry).toLowerCase();
      if (lower.startsWith("ja")) {
        return "ja";
      }
      if (lower.startsWith("zh")) {
        if (lower.includes("tw") || lower.includes("hk") || lower.includes("mo") || lower.includes("hant")) {
          return "zh-TW";
        }
        return "zh-CN";
      }
      if (lower.startsWith("en")) {
        return "en";
      }
    }

    const region = (Intl.DateTimeFormat().resolvedOptions().locale || "").split("-")[1] || "";
    if (["TW", "HK", "MO"].includes(region.toUpperCase())) return "zh-TW";
    if (["CN", "SG"].includes(region.toUpperCase())) return "zh-CN";
    if (region.toUpperCase() === "JP") return "ja";
    return "en";
  }

  restoreSettings() {
    const fallbackLang = this.detectLocaleLanguage();

    try {
      const raw = localStorage.getItem("sheep_counter_settings");
      if (!raw) {
        this.uiLang = fallbackLang;
        this.voiceLang = fallbackLang;
        this.syncSettingsToUI();
        return;
      }

      const parsed = JSON.parse(raw);
      this.speedMs = this.clamp(Number(parsed.speedMs) || 2000, 500, 5000);
      this.useVoice = Boolean(parsed.useVoice);
      this.uiLang = this.isSupportedLang(parsed.uiLang) ? parsed.uiLang : fallbackLang;
      this.voiceLang = this.isSupportedLang(parsed.voiceLang) ? parsed.voiceLang : this.uiLang;
      this.sheepType = this.isSupportedSheepType(parsed.sheepType) ? parsed.sheepType : "classic";
      this.fadeOutEnabled = Boolean(parsed.fadeOutEnabled);
      this.fadeOutDurationSec = this.clamp(Number(parsed.fadeOutDurationSec) || 30, 1, 3600);
    } catch {
      this.speedMs = 2000;
      this.useVoice = true;
      this.uiLang = fallbackLang;
      this.voiceLang = fallbackLang;
      this.sheepType = "classic";
      this.fadeOutEnabled = true;
      this.fadeOutDurationSec = 1800;
    }

    this.syncSettingsToUI();
  }

  syncSettingsToUI() {
    const speedSec = (this.speedMs / 1000).toFixed(1);
    this.speedRange.value = speedSec;
    this.speedValue.textContent = speedSec;

    this.uiLangSelect.value = this.uiLang;
    this.voiceToggle.checked = this.useVoice;
    this.voiceSelect.value = this.voiceLang;

    this.fadeOutToggle.checked = this.fadeOutEnabled;
    this.fadeOutInput.value = String(this.fadeOutDurationSec);
  }

  persistSettings() {
    const settings = {
      speedMs: this.speedMs,
      useVoice: this.useVoice,
      uiLang: this.uiLang,
      voiceLang: this.voiceLang,
      sheepType: this.sheepType,
      fadeOutEnabled: this.fadeOutEnabled,
      fadeOutDurationSec: this.fadeOutDurationSec,
    };

    try {
      localStorage.setItem("sheep_counter_settings", JSON.stringify(settings));
    } catch {
      // Ignore storage failures.
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  toggleSettings(forceState) {
    this.settingsOpen = typeof forceState === "boolean" ? forceState : !this.settingsOpen;
    this.settingsCard.hidden = !this.settingsOpen;
    this.settingsToggle.setAttribute("aria-expanded", String(this.settingsOpen));

    const text = this.t(this.settingsOpen ? "closeSettings" : "openSettings");
    this.settingsToggle.setAttribute("aria-label", text);
  }

  applyTranslations() {
    document.documentElement.lang = this.uiLang;

    this.titleText.textContent = this.t("title");
    this.subtitleText.textContent = this.t("subtitle");
    this.countLabel.textContent = this.t("countLabel");
    this.startBtn.textContent = this.t("start");
    this.pauseBtn.textContent = this.t("pause");
    this.resetBtn.textContent = this.t("reset");
    this.hintText.textContent = this.t("hint");

    this.uiLangLabel.textContent = this.t("uiLangLabel");
    this.sheepTypeLabel.textContent = this.t("sheepTypeLabel");
    this.speedLabel.textContent = this.t("speedLabel");
    this.voiceToggleLabel.textContent = this.t("voiceToggleLabel");
    this.voiceLangLabel.textContent = this.t("voiceLangLabel");
    this.fadeOutToggleLabel.textContent = this.t("fadeOutToggleLabel");
    this.fadeDurationLabel.textContent = this.t("fadeDurationLabel");
    this.secondsSuffix.textContent = this.t("secondsSuffix");

    for (const button of this.fadePresetButtons) {
      const seconds = Number(button.dataset.seconds);
      button.textContent = this.t("fadeButtonLabels")[seconds] || String(seconds);
    }

    this.populateSheepTypeOptions();
    this.toggleSettings(this.settingsOpen);
  }

  populateSheepTypeOptions() {
    const options = this.t("sheepOptions");
    const keys = ["classic", "lamb", "ram", "duo"];

    this.sheepTypeSelect.innerHTML = "";
    for (const key of keys) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = options[key] || key;
      this.sheepTypeSelect.appendChild(option);
    }

    this.sheepTypeSelect.value = this.sheepType;
  }

  start() {
    if (this.isRunning) return;

    this.cycleToken += 1;
    this.isRunning = true;
    this.lastLoopAt = performance.now();

    this.startBtn.disabled = true;
    this.pauseBtn.disabled = false;

    this.scheduleLoop();
  }

  pause() {
    if (!this.isRunning) return;

    this.cycleToken += 1;
    this.isRunning = false;
    this.pendingCycles = 0;
    this.startBtn.disabled = false;
    this.pauseBtn.disabled = true;

    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }

    if (this.synth?.speaking) {
      this.synth.cancel();
    }

    this.setSheepState("is-out");
  }

  reset() {
    this.pause();
    this.count = 0;
    this.sessionElapsedMs = 0;
    this.accumulatorMs = 0;
    this.pendingCycles = 0;
    this.render();
    this.setSheepState("is-out");
  }

  scheduleLoop() {
    if (!this.isRunning) return;

    this.loopTimer = setTimeout(() => {
      const now = performance.now();
      const delta = now - this.lastLoopAt;
      this.lastLoopAt = now;

      this.consumeTime(delta);
      this.scheduleLoop();
    }, 50);
  }

  consumeTime(deltaMs) {
    if (!this.isRunning || deltaMs <= 0) return;

    this.sessionElapsedMs += deltaMs;
    this.accumulatorMs += deltaMs;

    while (this.accumulatorMs >= this.speedMs) {
      this.accumulatorMs -= this.speedMs;
      this.pendingCycles += 1;
    }

    this.processCycleQueue();
  }

  async processCycleQueue() {
    if (this.cycleInProgress || !this.isRunning) return;

    this.cycleInProgress = true;
    const token = this.cycleToken;

    try {
      while (this.isRunning && token === this.cycleToken && this.pendingCycles > 0) {
        this.pendingCycles -= 1;
        await this.performCountCycle(token);
      }
    } finally {
      this.cycleInProgress = false;
    }
  }

  async performCountCycle(token) {
    if (!this.isRunning || token !== this.cycleToken) return;

    this.count += 1;
    this.render();

    const hasEntered = await this.animateSheepIn(token);
    if (!hasEntered) return;

    const volume = this.getCurrentVolume();
    await this.speakOnce(volume, token);

    if (!this.isRunning || token !== this.cycleToken) return;
    await this.animateSheepOut(token);
  }

  getCurrentVolume() {
    if (!this.fadeOutEnabled) {
      return 1;
    }

    const fadeDurationMs = this.fadeOutDurationSec * 1000;
    const ratio = fadeDurationMs > 0 ? this.sessionElapsedMs / fadeDurationMs : 1;
    return this.clamp(1 - ratio, 0, 1);
  }

  getSheepGlyph() {
    if (this.sheepType === "lamb") return "\uD83D\uDC11";
    if (this.sheepType === "ram") return "\uD83D\uDC0F";
    if (this.sheepType === "duo") return this.count % 2 === 0 ? "\uD83D\uDC11\uD83D\uDC11" : "\uD83D\uDC0F\uD83D\uDC11";
    return this.count % 2 === 0 ? "\uD83D\uDC11" : "\uD83D\uDC0F";
  }

  render() {
    this.countDisplay.textContent = String(this.count);
    this.sheepEl.textContent = this.getSheepGlyph();
  }

  setSheepState(state) {
    this.sheepEl.classList.remove("is-out", "is-visible", "is-entering", "is-exiting");
    this.sheepEl.classList.add(state);
  }

  animateSheepIn(token) {
    return this.animateSheepPhase("is-entering", "is-visible", token);
  }

  animateSheepOut(token) {
    return this.animateSheepPhase("is-exiting", "is-out", token);
  }

  animateSheepPhase(activeClass, finalClass, token) {
    if (!this.isRunning || token !== this.cycleToken) {
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      let settled = false;
      const finish = (ok) => {
        if (settled) return;
        settled = true;
        this.sheepEl.removeEventListener("animationend", onAnimationEnd);
        if (ok) {
          this.setSheepState(finalClass);
        } else {
          this.setSheepState("is-out");
        }
        resolve(ok);
      };

      const onAnimationEnd = (event) => {
        if (event.target !== this.sheepEl) return;
        finish(this.isRunning && token === this.cycleToken);
      };

      this.sheepEl.classList.remove("is-entering", "is-exiting");
      void this.sheepEl.offsetWidth;
      this.sheepEl.classList.remove("is-out", "is-visible");
      this.sheepEl.classList.add(activeClass);
      this.sheepEl.addEventListener("animationend", onAnimationEnd);

      window.setTimeout(() => finish(this.isRunning && token === this.cycleToken), 900);
    });
  }

  speakOnce(volume, token) {
    if (!this.useVoice || !this.synth || volume <= 0) {
      return this.waitMs(120, token);
    }

    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        resolve(this.isRunning && token === this.cycleToken);
      };

      // 手機瀏覽器（尤其 iOS）語音常不觸發 onend，導致 Promise 永不 resolve、計數卡住。逾時後強制繼續。
      const timeoutMs = 2500;
      const timeoutId = window.setTimeout(finish, timeoutMs);

      if (this.synth.speaking) {
        this.synth.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(this.getNumberText(this.count));
      const selectedVoice = this.voices.find((voice) => voice.lang.startsWith(this.voiceLang));

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = 0.82;
      utterance.pitch = 0.95;
      utterance.volume = volume;
      utterance.onend = finish;
      utterance.onerror = finish;

      this.synth.speak(utterance);
    });
  }

  waitMs(ms, token) {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(this.isRunning && token === this.cycleToken);
      }, ms);
    });
  }

  getNumberText(number) {
    const zhDigits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

    const toZh = (n) => {
      if (n < 10) return zhDigits[n];
      if (n < 20) return n === 10 ? "十" : `十${zhDigits[n - 10]}`;
      if (n < 100) {
        const tens = Math.floor(n / 10);
        const ones = n % 10;
        return `${zhDigits[tens]}十${ones === 0 ? "" : zhDigits[ones]}`;
      }
      return String(n);
    };

    if (this.voiceLang === "zh-TW") return `${toZh(number)}隻綿羊`;
    if (this.voiceLang === "zh-CN") return `${toZh(number)}\u53EA\u7EF5\u7F8A`;
    if (this.voiceLang === "ja") return `${number}\u5339\u306E\u7F8A`;
    return `${number} ${number === 1 ? "sheep" : "sheep"}`;
  }

  t(key) {
    const langPack = this.translations[this.uiLang] || this.translations.en;
    return langPack[key];
  }

  isSupportedLang(value) {
    return Object.prototype.hasOwnProperty.call(this.translations, value);
  }

  isSupportedSheepType(value) {
    return ["classic", "lamb", "ram", "duo"].includes(value);
  }

  exposeTestHooks() {
    window.render_game_to_text = () => {
      const state = {
        coordinate_system: "UI state only (no canvas). Origin top-left, +x right, +y down.",
        mode: this.isRunning ? "running" : "paused",
        count: this.count,
        sheep: this.sheepEl.textContent,
        settings: {
          open: this.settingsOpen,
          ui_language: this.uiLang,
          sheep_type: this.sheepType,
        },
        timing: {
          speed_ms_per_sheep: this.speedMs,
          session_elapsed_ms: Math.round(this.sessionElapsedMs),
          pending_ms_before_next_sheep: Math.round(this.speedMs - this.accumulatorMs),
          queued_cycles: this.pendingCycles,
        },
        audio: {
          voice_enabled: this.useVoice,
          voice_lang: this.voiceLang,
          fade_out_enabled: this.fadeOutEnabled,
          fade_out_duration_sec: this.fadeOutDurationSec,
          current_volume: Number(this.getCurrentVolume().toFixed(3)),
        },
      };

      return JSON.stringify(state);
    };

    window.advanceTime = (ms) => {
      const safeMs = Number(ms);
      if (!Number.isFinite(safeMs) || safeMs <= 0) {
        return;
      }

      this.consumeTime(safeMs);
    };
  }

  clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.sheepCounter = new SheepCounter();
});