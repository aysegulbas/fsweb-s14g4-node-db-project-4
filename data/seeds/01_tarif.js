/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const defaultTarif = {
  tarif_adi: "Spagetti Bolonez",
};
const defaultAdım = [
  {
    adim_sirasi: 1,
    adim_talimati: "Büyük bir tencereyi orta ateşe koyun",
    tarif_id: 1,
  },
  {
    adim_sirasi: 2,
    adim_talimati: "1 yemek kaşığı zeytinyağı ekleyin",
    tarif_id: 1,
  },
];
const defaultIcindekiler = [
  { icindekiler_adi: "zeytinyağı" },
  { icindekiler_adi: "tuz" },
];
const defaultIcindekilerAdim = [
  { icindekiler_id: 1, adim_id: 1, miktar: 0.1 },
  { icindekiler_id: 2, adim_id: 1, miktar: 1 },
  { icindekiler_id: 2, adim_id: 2, miktar: 0.5 },
];
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("tarif").truncate();
  await knex("adim").truncate();
  await knex("icindekiler").truncate();
  await knex("icindekiler_adim").truncate();

  await knex("tarif").insert(defaultTarif);
  await knex("adim").insert(defaultAdım);
  await knex("icindekiler").insert(defaultIcindekiler);
  await knex("icindekiler_adim").insert(defaultIcindekilerAdim);
};
