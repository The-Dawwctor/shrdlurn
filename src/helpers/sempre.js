import { SEMPRE_SERVER_URL } from "constants/strings"

function formatValue(value) {
    if (typeof value === "undefined") return "";
    const valueArray = JSON.parse(value);
    let formatArray = valueArray.map(c => {
	let result = {
	    names: c[0],
	    id: c[1],
	    x: c[2],
	    y: c[3],
	    z: c[4],
	    rotate: c[5],
	    color: c[6]
	}
	if (c[0].includes("PEPoint")) {
	    result.attract = c[7];
	}
	return result;
    });
    return formatArray;
}

function combine(vsTmp, v) {
  let vs = vsTmp;
  if (vs === undefined) {
    vs = {};
    vs.value = v.value;
    vs.formula = v.formula;
    vs.formulas = [vs.formula];
    vs.prob = parseFloat(v.prob);
    vs.probs = [v.prob];
    vs.pprob = parseFloat(v.pprob);
    vs.pprobs = [v.pprob];
    vs.score = parseFloat(v.score);
    vs.rank = v.rank;
    vs.count = 1;
    vs.maxprob = parseFloat(v.prob);
    vs.maxpprob = parseFloat(v.pprob);
    vs.error = v.error;
    vs.lines = v.lines;
  } else {
    vs.value = v.value;
    vs.prob += parseFloat(v.prob);
    vs.pprob += parseFloat(v.pprob);

    vs.score = Math.max(vs.score, parseFloat(v.score));
    vs.maxprob = Math.max(vs.maxprob, parseFloat(v.prob));
    vs.maxpprob = Math.max(vs.maxpprob, parseFloat(v.pprob));
    vs.rank = Math.min(vs.rank, v.rank);
    vs.probs.push(v.prob);
    vs.formulas.push(v.formula);
    vs.count += 1;
    vs.error = v.error;
    vs.lines = v.lines;
  }
  return vs;
}

export function parseSEMPRE(valid) {
  const lstqapairs = [];
  if (valid.length === 0) return undefined;

  for (let i = 0; i < valid.length; i++) {
    const qapair = {};
    try {
      qapair.value = formatValue(valid[i].value);
      qapair.formula = valid[i].formula;
      qapair.score = valid[i].score.toFixed(7);
      qapair.rank = i;
      qapair.prob = valid[i].prob;
      qapair.pprob = valid[i].pprob;
      lstqapairs.push(qapair);
    } catch (e) {
      lstqapairs.push({ value: [], formula: "", rank: i, error: valid[i].value, score: 0, prob: 0, pprob: 0 })
      alert("This response resulted in an error with our server. Please scroll to another intepretation or try another query. The error message was: " + valid[i].value)
      console.log("ERROR!", e, valid[i].value);
    }
  }

  const nbestdict = lstqapairs.reduce((nbd, nbest) => {
    const mynbd = nbd;
    const key = JSON.stringify(nbest.value);
    mynbd[key] = combine(nbd[key], nbest);
    return mynbd;
  }, {});

  const listqadedup = [];
  for (const key in nbestdict) {
    if ({}.hasOwnProperty.call(nbestdict, key)) {
      listqadedup.push(nbestdict[key]);
    }
  }
  listqadedup.sort((a, b) => b.score - a.score + 1e-3 * (a.rank - b.rank));
  return listqadedup;
}

export function SEMPREquery(cmds, callback) {
  const cmdstr = []
  for (const k in cmds) {
    if ({}.hasOwnProperty.call(cmds, k)) {
      cmdstr.push(`${k}=${encodeURIComponent(cmds[k])}`)
    }
  }

  return fetch(`${SEMPRE_SERVER_URL}/sempre?format=lisp2json&${cmdstr.join("&")}`)
    .then((response) => {
      return response.json()
    })
    .catch((ex) => {
      console.log("fetch issue?", ex)
    })
}
