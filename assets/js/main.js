/* ==========================================================
   Jason Mensching portfolio: behavior
   ========================================================== */

/* ---- EDIT HERE ---------------------------------------------------
   formEndpoint : paste a form-service URL (for example a Formspree
                  endpoint like "https://formspree.io/f/xxxxxxxx") to
                  deliver messages straight to your inbox. While it is
                  empty, the form opens the visitor's email app with the
                  message prepared instead.
   linkedin     : your LinkedIn profile URL, or leave "" to hide it.
   onlinejobs   : your OnlineJobs.ph profile URL, or leave "" to hide it.
   ------------------------------------------------------------------ */
var CONFIG = {
  email: "menschingjas@gmail.com",
  formEndpoint: "",
  linkedin: "",
  onlinejobs: ""
};

(function () {
  "use strict";

  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Optional profile links ---------- */
  [["linkedin", "li-linkedin", "link-linkedin"], ["onlinejobs", "li-onlinejobs", "link-onlinejobs"]].forEach(function (p) {
    if (CONFIG[p[0]]) {
      $("#" + p[2]).href = CONFIG[p[0]];
      $("#" + p[1]).hidden = false;
    }
  });
  if (CONFIG.formEndpoint) { $("#form-note").hidden = true; }

  /* ---------- Theme toggle ---------- */
  var themeBtn = $("#theme-toggle");
  function syncThemeBtn() {
    var dark = doc.documentElement.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-pressed", String(dark));
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
  themeBtn.addEventListener("click", function () {
    var next = doc.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    doc.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("jm-theme", next); } catch (e) { /* storage unavailable */ }
    syncThemeBtn();
  });
  syncThemeBtn();

  /* ---------- Mobile menu ---------- */
  var menuBtn = $("#menu-toggle");
  var nav = $("#primary-nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    doc.body.classList.toggle("menu-open", open);
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia("(min-width: 861px)").addEventListener("change", function (e) { if (e.matches) setMenu(false); });
  /* Menu links are hidden from keyboard and screen readers while the mobile menu is closed */
  function syncNavVisibility() {
    var mobile = window.matchMedia("(max-width: 860px)").matches;
    if (mobile && !nav.classList.contains("open")) { nav.setAttribute("inert", ""); } else { nav.removeAttribute("inert"); }
  }
  syncNavVisibility();
  window.addEventListener("resize", syncNavVisibility);
  new MutationObserver(syncNavVisibility).observe(nav, { attributes: true, attributeFilter: ["class"] });

  /* ---------- Header shadow, back-to-top ---------- */
  var header = $(".site-header");
  var toTop = $("#to-top");
  function onScroll() {
    var y = window.scrollY || doc.documentElement.scrollTop;
    header.classList.toggle("scrolled", y > 8);
    toTop.hidden = y < 700;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    $("#top").setAttribute("tabindex", "-1");
    $("#top").focus({ preventScroll: true });
  });

  /* ---------- Active nav link on scroll ---------- */
  var navLinks = $$('.nav-links > a[href^="#"]');
  var targets = navLinks.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (a) {
            if (a.getAttribute("href") === "#" + en.target.id) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$(".reveal");
  var steps = $("#steps");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    io.observe(steps);
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
    steps.classList.add("in");
  }

  /* ---------- Industry tabs + filter ---------- */
  var tabs = $$('[role="tab"]');
  var panels = $$('[role="tabpanel"]');
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p) { p.hidden = p.id !== tab.getAttribute("aria-controls"); });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { selectTab(t, false); });
    t.addEventListener("keydown", function (e) {
      var vis = tabs.filter(function (x) { return !x.hidden; });
      var i = vis.indexOf(t);
      var next = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next = vis[(i + 1) % vis.length];
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = vis[(i - 1 + vis.length) % vis.length];
      if (e.key === "Home") next = vis[0];
      if (e.key === "End") next = vis[vis.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });
  var chips = $$(".chip");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      var f = c.getAttribute("data-filter");
      chips.forEach(function (x) { x.setAttribute("aria-pressed", String(x === c)); });
      tabs.forEach(function (t) { t.hidden = !(f === "all" || t.getAttribute("data-kind") === f); });
      var current = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0];
      if (current && current.hidden) {
        var first = tabs.filter(function (t) { return !t.hidden; })[0];
        if (first) selectTab(first, false);
      }
    });
  });

  /* ---------- Links that pre-select the support type ---------- */
  var typeSelect = $("#f-type");
  $$("[data-service]").forEach(function (a) {
    a.addEventListener("click", function () {
      var wanted = a.getAttribute("data-service");
      Array.prototype.forEach.call(typeSelect.options, function (o) {
        if (o.text === wanted) typeSelect.value = o.value || o.text;
      });
    });
  });

  /* ---------- Sample modals ---------- */
  function table(headers, rows) {
    var h = headers.map(function (x) { return "<th scope=\"col\">" + x + "</th>"; }).join("");
    var b = rows.map(function (r) {
      return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
    }).join("");
    return "<div class=\"table-wrap\"><table class=\"demo-table\"><thead><tr>" + h + "</tr></thead><tbody>" + b + "</tbody></table></div>";
  }
  function info(problem, process, skills) {
    return "<div class=\"sd-cols\"><div><h4>The problem</h4><p>" + problem + "</p></div>" +
      "<div><h4>What it shows</h4><p>" + process + "</p></div>" +
      "<div><h4>Skills involved</h4><p>" + skills + "</p></div></div>";
  }
  function st(t, wait) { return "<span class=\"st" + (wait ? " wait" : "") + "\">" + t + "</span>"; }

  var SAMPLES = {
    pipeline: {
      title: "Pipeline organization",
      html: function () {
        function col(name, cards) {
          return "<div class=\"board-col\"><h5>" + name + "</h5>" + cards.map(function (c) {
            return "<div class=\"bcard\"><strong>" + c[0] + "</strong><span>" + c[1] + "</span></div>";
          }).join("") + "</div>";
        }
        return info(
          "Leads sit in the wrong stage or have no next step, so nobody knows who to contact today.",
          "Each lead has exactly one stage, one next action, and one due day. Notes are short and dated.",
          "CRM record upkeep, pipeline stages, follow-up task setting, GoHighLevel-style workflow."
        ) + "<p class=\"demo-label\">Sample pipeline (fictional leads)</p><div class=\"board\">" +
          col("New lead", [["Sample Business A", "First call, Mon"], ["Sample Business B", "Intro email, Mon"]]) +
          col("Contacted", [["Sample Business C", "Follow-up text, Wed"]]) +
          col("Docs requested", [["Sample Business D", "Chase statements, Tue"], ["Sample Business E", "Confirm receipt, Thu"]]) +
          col("Ready for review", [["Sample Business G", "Hand off to owner, Wed"]]) +
          col("Handed off", [["Sample Business H", "Closed out in CRM"]]) + "</div>";
      }
    },
    tracker: {
      title: "Follow-up tracker",
      html: function () {
        return info(
          "Follow-ups live in people's heads, and warm leads go quiet.",
          "A sheet sorted by due date, with the last outcome and the exact next step for each lead.",
          "Google Sheets, lead tracking, email and SMS follow-up, record keeping."
        ) + "<p class=\"demo-label\">Sample follow-up sheet (fictional leads)</p>" + table(
          ["Lead", "Last contact", "Outcome", "Next step", "Due"],
          [
            ["Sample Lead 01", "Call, Mon", "No answer, voicemail left", "Text message", "Tue"],
            ["Sample Lead 02", "Email, Mon", "Asked for details", "Send overview, call after", "Tue"],
            ["Sample Lead 03", "Call, Tue", "Interested, needs time", "Check in", "Fri"],
            ["Sample Lead 04", "Text, Wed", "Replied, wants a call", "Call at preferred time", "Thu"],
            ["Sample Lead 05", "Call, Wed", "Not interested now", "Re-contact later", "Next month"]
          ]
        );
      }
    },
    intake: {
      title: "Funding intake checklist",
      html: function () {
        return info(
          "Applications stall when documents arrive in pieces and nobody knows what is still missing.",
          "A single checklist per applicant: what has arrived, what is missing, and who has the next move. It prepares the file. It does not decide anything.",
          "Document collection, application information review, follow-up, clean hand-offs."
        ) + "<p class=\"demo-label\">Sample applicant file (fictional)</p>" + table(
          ["Item", "Status", "Note"],
          [
            ["Business type and time in business", st("Received"), "Entered in CRM"],
            ["Monthly revenue", st("Received"), "As stated by applicant"],
            ["Requested amount", st("Received"), "Entered in CRM"],
            ["Bank statements", st("Requested", true), "Follow up if not received in 2 days"],
            ["Other required documents", st("Pending", true), "Per the business's own checklist"],
            ["Hand-off", st("Not ready", true), "Send to the assigned colleague once all items are in"]
          ]
        ) + "<p style=\"margin:14px 0 0;font-size:.9rem;color:var(--muted)\">Qualification criteria and funding decisions belong to the business owner and lender, not to this checklist.</p>";
      }
    },
    calllog: {
      title: "Appointment-setting call log",
      html: function () {
        return info(
          "Calls happen, but results go unrecorded, so the same lead is called twice or never called again.",
          "A short call flow plus a log that captures every attempt and the agreed next step.",
          "Outbound calling, appointment setting, call logging, CRM notes."
        ) + "<p class=\"demo-label\">Sample call flow</p><ol class=\"flow\">" +
          "<li>Greet, say who I'm calling for, and confirm it's a good time.</li>" +
          "<li>Reference their earlier interest in a sentence.</li>" +
          "<li>Offer two appointment times.</li>" +
          "<li>Confirm the time, contact details, and reminder method.</li>" +
          "<li>Log the result and set the next task right away.</li></ol>" +
          "<p class=\"demo-label\">Sample log (fictional)</p>" + table(
            ["Lead", "Attempt", "Result", "Booked", "Next"],
            [
              ["Sample Lead 11", "1", "Voicemail", "No", "Text, then call tomorrow"],
              ["Sample Lead 12", "2", "Spoke, interested", st("Booked"), "Reminder the day before"],
              ["Sample Lead 13", "1", "Asked to call later", "No", "Call Thu 5pm"],
              ["Sample Lead 14", "3", "No answer", "No", "Final text, then pause"]
            ]
          );
      }
    },
    outreach: {
      title: "Property owner outreach tracker",
      html: function () {
        return info(
          "Cold-call lists produce a few good conversations, and without tracking they are easy to lose.",
          "One row per property owner, with the call result, interest level, and the next action.",
          "Cold calling, lead lists, appointment scheduling, research with Zillow and Redfin."
        ) + "<p class=\"demo-label\">Sample outreach list (fictional owners and addresses)</p>" + table(
          ["Owner", "Property", "Call result", "Interest", "Next step"],
          [
            ["Sample Owner 1", "Sample Street, Unit A", "Reached", st("Interested"), "Book appointment with local rep"],
            ["Sample Owner 2", "Sample Avenue, #12", "No answer", "Unknown", "Retry Thursday"],
            ["Sample Owner 3", "Sample Road, House 4", "Reached", "Not now", "Check in next quarter"],
            ["Sample Owner 4", "Sample Lane, Lot 7", "Wrong number", "None", "Research contact info"]
          ]
        );
      }
    },
    case: {
      title: "Case documentation template",
      html: function () {
        return info(
          "When a case changes hands, missing notes force the customer to repeat everything.",
          "A consistent record of the issue, what was verified, the steps taken, and who owns the next action.",
          "Documentation, account verification, following procedure, escalation routing."
        ) + "<p class=\"demo-label\">Sample case record (fictional)</p>" + table(
          ["Field", "Entry"],
          [
            ["Contact", "Sample Customer, reached by email"],
            ["Issue", "Asking about the status of a pending request"],
            ["Verified", "Account details confirmed against the file"],
            ["Steps taken", "Reviewed the record, explained the current stage, listed what is still needed"],
            ["Next step", "Customer sends the missing document by Friday"],
            ["Owner and date", "Support team to review on Monday"]
          ]
        );
      }
    }
  };

  var dialog = $("#sample-dialog");
  var lastTrigger = null;
  $$("[data-sample]").forEach(function (b) {
    b.addEventListener("click", function () {
      var s = SAMPLES[b.getAttribute("data-sample")];
      lastTrigger = b;
      $("#sd-title").textContent = s.title;
      $("#sd-body").innerHTML = s.html();
      if (typeof dialog.showModal === "function") { dialog.showModal(); } else { dialog.setAttribute("open", ""); }
      doc.body.style.overflow = "hidden";
      dialog.scrollTop = 0;
    });
  });
  function closeDialog() {
    if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open");
  }
  $("#sd-close").addEventListener("click", closeDialog);
  dialog.addEventListener("click", function (e) { if (e.target === dialog) closeDialog(); });
  dialog.addEventListener("close", function () {
    doc.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
  });

  /* ---------- Contact form ---------- */
  var form = $("#contact-form");
  var summary = $("#form-errors");
  var statusEl = $("#form-status");
  var submitBtn = $("#submit-btn");
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = [
    { id: "f-name", err: "e-name", label: "Name", test: function (v) { return v.trim().length >= 2; }, msg: "Please enter your name." },
    { id: "f-email", err: "e-email", label: "Business email", test: function (v) { return emailRe.test(v.trim()); }, msg: "Please enter a valid email address, like name@company.com." },
    { id: "f-type", err: "e-type", label: "Type of support needed", test: function (v) { return v !== ""; }, msg: "Please choose the type of support you need." },
    { id: "f-details", err: "e-details", label: "Project details", test: function (v) { return v.trim().length >= 20; }, msg: "Please add a few details (at least 20 characters) so I can respond usefully." }
  ];

  function showErr(rule, show) {
    var input = $("#" + rule.id), p = $("#" + rule.err);
    if (show) {
      input.setAttribute("aria-invalid", "true");
      p.textContent = rule.msg; p.hidden = false;
    } else {
      input.removeAttribute("aria-invalid");
      p.hidden = true; p.textContent = "";
    }
  }
  rules.forEach(function (r) {
    var el = $("#" + r.id);
    el.addEventListener("blur", function () { if (el.value !== "" || el.hasAttribute("aria-invalid")) showErr(r, !r.test(el.value)); });
    el.addEventListener("input", function () { if (el.hasAttribute("aria-invalid") && r.test(el.value)) showErr(r, false); });
    el.addEventListener("change", function () { if (el.hasAttribute("aria-invalid") && r.test(el.value)) showErr(r, false); });
  });

  function setStatus(msg, isErr) {
    statusEl.textContent = msg;
    statusEl.classList.toggle("error", !!isErr);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setStatus("", false);
    var bad = rules.filter(function (r) { var ok = r.test($("#" + r.id).value); showErr(r, !ok); return !ok; });

    if (bad.length) {
      summary.hidden = false;
      summary.innerHTML = "<strong>Please fix " + (bad.length === 1 ? "1 field" : bad.length + " fields") + ":</strong><ul>" +
        bad.map(function (r) { return "<li><a href=\"#" + r.id + "\">" + r.label + "</a>: " + r.msg + "</li>"; }).join("") + "</ul>";
      summary.focus();
      $$("a", summary).forEach(function (a) {
        a.addEventListener("click", function (ev) { ev.preventDefault(); $(a.getAttribute("href")).focus(); });
      });
      return;
    }
    summary.hidden = true; summary.innerHTML = "";

    var data = {
      name: $("#f-name").value.trim(),
      email: $("#f-email").value.trim(),
      company: $("#f-company").value.trim(),
      support_needed: typeSelect.value,
      details: $("#f-details").value.trim()
    };

    if ($(".hp", form).value) { return; } /* honeypot filled: ignore */

    if (CONFIG.formEndpoint) {
      submitBtn.disabled = true; submitBtn.textContent = "Sending...";
      fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error("bad response");
        form.reset();
        setStatus("Thanks, your message was sent. I'll reply by email.", false);
      }).catch(function () {
        setStatus("The message could not be sent. Please email " + CONFIG.email + " directly.", true);
      }).then(function () {
        submitBtn.disabled = false; submitBtn.textContent = "Send message";
      });
    } else {
      var subject = "Inquiry: " + data.support_needed + (data.company ? " (" + data.company + ")" : "");
      var body = "Hi Jason,\n\n" + data.details + "\n\nSupport needed: " + data.support_needed +
        "\nCompany: " + (data.company || "n/a") + "\n\nName: " + data.name + "\nEmail: " + data.email;
      window.location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      setStatus("Your email app should now open with the message ready. If nothing opens, email " + CONFIG.email + " directly.", false);
    }
  });
})();
