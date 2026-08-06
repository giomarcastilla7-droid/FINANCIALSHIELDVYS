(function () {
  "use strict";

  /* =====================================================================
     CONFIGURACIÓN — reemplazar antes de publicar
     ===================================================================== */
  // Número real de WhatsApp Business de V&S Abogados (+57 304 304 6875),
  // en formato internacional, solo dígitos.
  var WHATSAPP_NUMBER = "573043046875";

  var dataLayer = (window.dataLayer = window.dataLayer || []);

  function track(eventName, payload) {
    dataLayer.push(
      Object.assign({ event: eventName }, payload || {})
    );
  }

  function buildWhatsAppUrl(message) {
    var text = encodeURIComponent(message || "Hola, quisiera más información.");
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;
  }

  /* =====================================================================
     WHATSAPP CTAs — construir enlace + trackear clic por sección
     ===================================================================== */
  function initWhatsAppCtas() {
    var ctas = document.querySelectorAll(".js-wa-cta");
    ctas.forEach(function (el) {
      var section = el.getAttribute("data-section") || "unknown";
      var message = el.getAttribute("data-message") || "";
      el.setAttribute("href", buildWhatsAppUrl(message));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");

      el.addEventListener("click", function () {
        track("whatsapp_" + section + "_click", { cta_section: section });
        track("whatsapp_click", { cta_section: section });
      });
    });
  }

  /* =====================================================================
     FAQ ACCORDION
     ===================================================================== */
  function initFaq() {
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      var btn = item.querySelector(".faq-question");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");

        items.forEach(function (other) {
          if (other !== item) {
            other.classList.remove("is-open");
            var otherBtn = other.querySelector(".faq-question");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          }
        });

        item.classList.toggle("is-open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));

        if (!isOpen) {
          track("faq_open", { faq_question: btn.textContent.trim() });
        }
      });
    });
  }

  /* =====================================================================
     ELIGIBILITY QUIZ ("¿Puedo aplicar?")
     ===================================================================== */
  function initEligibilityQuiz() {
    var form = document.getElementById("eligibility-quiz");
    if (!form) return;

    var questions = form.querySelectorAll(".quiz-question");
    var progressBar = document.getElementById("quiz-progress-bar");
    var resultBox = document.getElementById("quiz-result");
    var resultText = document.getElementById("quiz-result-text");
    var quizCta = document.getElementById("quiz-cta");
    var answers = {};

    function updateProgress() {
      var answeredCount = Object.keys(answers).length;
      var pct = (answeredCount / questions.length) * 100;
      progressBar.style.width = pct + "%";

      if (answeredCount === questions.length) {
        showResult();
      }
    }

    function showResult() {
      var yesCount = Object.keys(answers).filter(function (k) {
        return answers[k] === "si";
      }).length;

      var message;
      if (yesCount >= 2) {
        message =
          "Tu situación tiene varias señales que vale la pena revisar con más detalle.";
      } else {
        message =
          "Cada caso es distinto. Una consulta gratuita puede ayudarte a salir de dudas sobre tu situación.";
      }
      resultText.textContent = message;
      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });

      var waMessage =
        "Hola, respondí el diagnóstico rápido de la página (" +
        yesCount +
        " de " +
        questions.length +
        " señales identificadas) y quiero saber si puedo aplicar a insolvencia de persona natural.";
      quizCta.setAttribute("href", buildWhatsAppUrl(waMessage));
      quizCta.setAttribute("data-message", waMessage);

      track("eligibility_quiz_completed", { quiz_yes_count: yesCount });
    }

    questions.forEach(function (q) {
      var qId = q.getAttribute("data-question");
      var opts = q.querySelectorAll(".quiz-opt");
      opts.forEach(function (opt) {
        opt.addEventListener("click", function () {
          opts.forEach(function (o) { o.classList.remove("is-selected"); });
          opt.classList.add("is-selected");
          answers[qId] = opt.getAttribute("data-value");
          updateProgress();
        });
      });
    });
  }

  /* =====================================================================
     SCROLL DEPTH TRACKING
     ===================================================================== */
  function initScrollTracking() {
    var fired50 = false;
    var fired90 = false;

    function onScroll() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      var pct = (scrollTop / docHeight) * 100;

      if (!fired50 && pct >= 50) {
        fired50 = true;
        track("scroll_50");
      }
      if (!fired90 && pct >= 90) {
        fired90 = true;
        track("scroll_90");
        window.removeEventListener("scroll", onScroll);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* =====================================================================
     FOOTER YEAR
     ===================================================================== */
  function initFooterYear() {
    var el = document.getElementById("footer-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* =====================================================================
     INIT
     ===================================================================== */
  document.addEventListener("DOMContentLoaded", function () {
    initWhatsAppCtas();
    initFaq();
    initEligibilityQuiz();
    initScrollTracking();
    initFooterYear();
  });
})();
