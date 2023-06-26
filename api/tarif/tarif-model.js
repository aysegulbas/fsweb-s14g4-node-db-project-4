const db = require("../../data/db-config");
//*2.çözüm için aşağıdakini yaptık
async function adimIdYeGoreIcindekilerGetir(adim_id) {
  let icindekiler = await db("icindekiler_adim as ia")
    .leftJoin("icindekiler as i", "i.icindekiler_id", "ia.icindekiler_id")
    .leftJoin("adim as a", "a.adim_id", "ia.adim_id")
    .select("ia.icindekiler_id", "i.icindekiler_adi", "ia.miktar")
    .where("ia.adim_id", adim_id);
  return icindekiler;
}

//*ilk önce sqlde şablonu hazırlmaalıyız. burda knex formatını yazmalıyız

async function idyeGoreTarifGetir(tarif_id) {
  const tarifler = await db("tarif as t")
    .leftJoin("adim as a", "a.tarif_id", "t.tarif_id")
    .leftJoin("icindekiler_adim as ia", "ia.adim_id", "a.adim_id")
    .leftJoin("icindekiler as i", "i.icindekiler_id", "ia.icindekiler_id")
    .select(
      "t.*",
      "a.adim_id",
      "a.adim_sirasi",
      "a.adim_talimati",
      "i.icindekiler_id",
      "i.icindekiler_adi",
      "ia.miktar"
    )
    .where("t.tarif_id", tarif_id);
  //middeleware'deki if'in çalışması için aşağıdakini yazmalıyız.
  if (tarifler.length == 0) {
    return null;
  }
  //görselde bizden ne istiyorlarsa onun kalıbını çıkarmalıyız
  //eğer yukardaki null ifinden kurtulduysa arrayde en az bir tane eleman var demek, o yüzden [0] kullanabiliriz, çünkü her satırda aynı
  let responseTarifModel = {
    tarif_id: tarifler[0].tarif_id,
    tarif_adi: tarifler[0].tarif_adi,
    kayit_tarihi: tarifler[0].kayit_tarihi,
    adimlar: [],
  };
  //üstteki "adımlar" arrayinin içini doldurmak için aşağıdaki for let döngüsünü yaptık.
  //çıkanları boş arraya push ettik
  //tariflerin herbir elemanı tarif. sql'de her tarif_id 1 olan herbir sırada bir adım var.  [0]kullanmadık her staırda değişiyor

  for (let i = 0; i < tarifler.length; i++) {
    const tarif = tarifler[i];
    let adimModel = {
      adim_id: tarif.adim_id,
      adim_sirasi: tarif.adim_sirasi,
      adim_talimati: tarif.adim_talimati,
      icindekiler: [],
    };
    //aşağıda görüleceği üzere içindekiler için de for let yapabilirdik, ama ikinci yol denedik. amacımız performans yükünü sql'e yüklemek çünkü milyonlarca veri olsaydı, for let performansı düşürürdü.
    //fonksiyonu yukarda tanımlamıştık ama push'lu çözüm burda çalışmadı, biz de eşitledik.
    //verilen id için tarif olmayabilir. Ama tarif varsa içinde adım vardır. Ama her adımda içindekiler olmak zorunda değil (örneğin tencereyi ocağa koy gibi)
   //array içinde aray oldu pushladığımız için. O yüzden direkt değişikene eşitledik
    if (!!tarif.icindekiler_id) {
      let fromDb = await adimIdYeGoreIcindekilerGetir(tarif.adim_id);
      adimModel.icindekiler = fromDb;
    }

    /* for (let j = 0; j < tarif.length; j++) {
            const item = tarif[j];
            if(!!item.icindekiler_id && tarif.adim_id == item.adim_id){
                let icindekiler_model={
                    icindekiler_id:item.icindekiler_id,
                    icindekiler_adi:item.icindekiler_adi,
                    miktar:item.miktar
                }
                adimModel.icindekiler.push(icindekiler_model);
            }
        }*/
    //en sonda da tümünü ana modele puzhladık
    responseTarifModel.adimlar.push(adimModel);
  }

  return responseTarifModel;
}

module.exports = {
  idyeGoreTarifGetir,
};
