"use client";

import { useEffect, useRef, useState } from "react";

const SURAH = 2;
const TOTAL_AYAHS = 286;

type Ayah = { text: string; audio?: string };

type Mode = "arabic" | "translit";

export default function Home() {
  const [arabicData, setArabicData] = useState<Ayah[]>([]);
  const [translitData, setTranslitData] = useState<Ayah[]>([]);
  const [translationData, setTranslationData] = useState<Ayah[]>([]);
  const [audioData, setAudioData] = useState<Ayah[]>([]);

  const [current, setCurrent] = useState(1);
  const [mode, setMode] = useState<Mode>("arabic");
  const [loop, setLoop] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const url = `https://api.alquran.cloud/v1/surah/${SURAH}/editions/quran-uthmani,en.transliteration,ru.kuliev,ar.alafasy`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("network");
        const json = await res.json();
        const editions = json.data;
        setArabicData(
          editions.find((e: any) => e.edition.identifier === "quran-uthmani")
            .ayahs
        );
        setTranslitData(
          editions.find(
            (e: any) => e.edition.identifier === "en.transliteration"
          ).ayahs
        );
        setTranslationData(
          editions.find((e: any) => e.edition.identifier === "ru.kuliev")
            .ayahs
        );
        setAudioData(
          editions.find((e: any) => e.edition.identifier === "ar.alafasy")
            .ayahs
        );
        setStatus("ready");
      } catch (err) {
        setStatus("error");
      }
    };
    load();
  }, []);

  useEffect(() => {
    // При смене аята — сброс плеера
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [current]);

  const go = (n: number) => {
    const next = Math.min(Math.max(n, 1), TOTAL_AYAHS);
    setCurrent(next);
  };

  const togglePlay = () => {
    const player = audioRef.current;
    if (!player) return;
    if (player.paused) {
      player.play();
      setPlaying(true);
    } else {
      player.pause();
      setPlaying(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-inkSoft">
        Загружаю аяты…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-inkSoft">
        Не удалось загрузить данные.
        <br />
        Проверьте подключение и обновите страницу.
      </div>
    );
  }

  const i = current - 1;
  const arabic = arabicData[i]?.text ?? "";
  const translit = translitData[i]?.text ?? "";
  const translation = translationData[i]?.text ?? "";
  const audioUrl = audioData[i]?.audio ?? "";

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-14">
      {/* Header */}
      <header className="text-center mb-5">
        <div className="text-xs tracking-[0.18em] uppercase text-gold font-semibold mb-1">
          Сура 2
        </div>
        <h1 className="font-lora text-2xl text-green m-0">
          سورة البقرة — Аль-Бакара
        </h1>
        <p className="text-sm text-inkSoft mt-1.5">
          Выберите аят, нажмите «Слушать» и повторяйте за чтецом
        </p>
      </header>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-2.5 mb-4 flex-wrap">
        <button
          onClick={() => go(current - 1)}
          disabled={current === 1}
          aria-label="Предыдущий аят"
          className="w-10 h-10 rounded-full border border-border bg-surface text-green text-lg disabled:opacity-35 hover:bg-sand transition"
        >
          ‹
        </button>
        <div className="flex items-center gap-2 bg-surface border border-border rounded-full px-3.5 py-1.5 text-sm">
          <span>Аят</span>
          <input
            type="number"
            min={1}
            max={TOTAL_AYAHS}
            value={current}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v)) go(v);
            }}
            className="w-12 text-center bg-transparent outline-none"
          />
          <span className="text-inkSoft">из {TOTAL_AYAHS}</span>
        </div>
        <button
          onClick={() => go(current + 1)}
          disabled={current === TOTAL_AYAHS}
          aria-label="Следующий аят"
          className="w-10 h-10 rounded-full border border-border bg-surface text-green text-lg disabled:opacity-35 hover:bg-sand transition"
        >
          ›
        </button>
      </div>

      {/* Card */}
      <div className="relative bg-surface border border-border rounded-2xl px-7 py-9 shadow-sm">
        <div className="corner tl" />
        <div className="corner tr" />
        <div className="corner bl" />
        <div className="corner br" />

        <div className="text-center text-xs tracking-[0.14em] uppercase text-gold font-semibold mb-3.5">
          2:{current}
        </div>

        {/* Mode switch */}
        <div className="flex justify-center gap-1.5 mb-6">
          <button
            onClick={() => setMode("arabic")}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition ${
              mode === "arabic"
                ? "bg-green text-white border-green"
                : "bg-sand text-inkSoft border-border"
            }`}
          >
            Арабский
          </button>
          <button
            onClick={() => setMode("translit")}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition ${
              mode === "translit"
                ? "bg-green text-white border-green"
                : "bg-sand text-inkSoft border-border"
            }`}
          >
            Транскрипция
          </button>
        </div>

        {mode === "arabic" ? (
          <p className="font-amiri text-[34px] sm:text-[28px] leading-[2.1] text-right text-green m-0 mb-2" dir="rtl">
            {arabic}{" "}
            <span className="font-inter text-base text-gold border border-gold rounded-full inline-flex items-center justify-center w-[30px] h-[30px] align-middle mx-1.5">
              {current}
            </span>
          </p>
        ) : (
          <p className="font-lora italic text-lg leading-[1.7] text-greenSoft m-0 mb-2">
            {translit}
          </p>
        )}

        <hr className="border-t border-dashed border-border my-5" />

        <div className="font-lora text-base leading-[1.7] text-ink">
          <span className="block font-inter text-[11px] tracking-[0.14em] uppercase text-inkSoft mb-1.5 font-semibold">
            Перевод (Кулиев)
          </span>
          {translation}
        </div>

        {/* Audio bar */}
        <div className="mt-6 flex items-center gap-3.5 bg-sand rounded-2xl px-4 py-3 flex-wrap">
          <button
            onClick={togglePlay}
            aria-label="Слушать"
            className="w-[46px] h-[46px] rounded-full bg-green text-white text-lg flex items-center justify-center flex-shrink-0 hover:bg-greenSoft transition"
          >
            {playing ? "❙❙" : "▶"}
          </button>
          <div className="text-sm text-inkSoft flex-1 min-w-[120px]">
            Аят <b className="text-ink">2:{current}</b> · Мишари аль-Афаси
          </div>
          <label className="flex items-center gap-1.5 text-sm text-inkSoft cursor-pointer select-none">
            <input
              type="checkbox"
              checked={loop}
              onChange={(e) => setLoop(e.target.checked)}
              className="w-4 h-4 accent-green"
            />
            Повторять
          </label>
        </div>
        <audio
          ref={audioRef}
          src={audioUrl}
          loop={loop}
          onEnded={() => !loop && setPlaying(false)}
          preload="none"
        />
      </div>

      <footer className="text-center mt-7 text-xs text-inkSoft leading-relaxed">
        Чтец: Мишари Рашид аль-Афаси · Перевод: Кулиев · Транскрипция: AlQuran
        Cloud
        <br />
        Данные:{" "}
        <a
          href="https://alquran.cloud/api"
          target="_blank"
          className="text-green"
        >
          api.alquran.cloud
        </a>
      </footer>
    </div>
  );
}
