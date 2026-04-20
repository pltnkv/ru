// ARASAAC pictogram IDs for curriculum words
// License: CC-BY-NC-SA — https://arasaac.org/terms-of-use
// Image URL: https://static.arasaac.org/pictograms/{id}/{id}_500.png

export const PICTOGRAM_IDS = {
  // Level 1
  'МАМА':   2458,
  'УМ':     2696,   // мозг

  // Level 2
  'ОСА':    2239,
  'УС':     2661,   // усы
  'СОМ':    34355,
  'МУХА':   2478,
  'УХО':    2871,

  // Level 3
  'КОТ':    2406,
  'СОК':    11461,
  'НОС':    2887,
  'СУП':    2573,
  'ПАПА':   2497,
  'КИНО':   4602,
  'САНКИ':  8710,
  'ПАУК':   2254,
  'КОСА':   5599,

  // Level 4
  'РАК':    2312,
  'СЫР':    2541,
  'РЫБА':   2520,
  'МЫЛО':   2964,
  'ЛАМПА':  4937,
  'БУСЫ':   2347,
  'ВАТА':   2985,
  'ВОРОНА': 4619,
  'КОРОВА': 2609,

  // Level 5
  'ДОМ':    2317,
  'ЖУК':    3301,
  'КОЗА':   2295,
  'ЖАБА':   3384,
  'ШАРИК':  32516,
  'ГРОЗА':  34892,
  'ГУБА':   2953,   // lips
  'ЗВЕЗДА': 2752,

  // Level 6
  'МЯСО':   2316,
  'ЛЕС':    2666,
  'ЛЁД':    7128,
  'МЁД':    2911,
  'ЮЛА':    8663,
  'ЯМА':    38076,
  'КОНЬ':   34205,
  'СОЛЬ':   25576,
  'ЁЖИК':   26829,
  'ЕНОТ':   10239,

  // Level 7
  'ЧАЙ':    2429,
  'ЧУДО':   24181,
  'ЩИТ':    7089,
  'РОЩА':   32462,
  'ЦАПЛЯ':  3015,   // аист (stork) as substitute
  'ЦЕПЬ':   5934,
};

const BASE_URL = 'https://static.arasaac.org/pictograms';

export function getPictogramUrl(word, size = 500) {
  const id = PICTOGRAM_IDS[word?.toUpperCase()];
  if (!id) return null;
  return `${BASE_URL}/${id}/${id}_${size}.png`;
}

export function hasPictogram(word) {
  return !!PICTOGRAM_IDS[word?.toUpperCase()];
}
