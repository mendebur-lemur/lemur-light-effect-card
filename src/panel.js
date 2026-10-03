// ---- Lemur Light Effect Card: control panel ("Lemur Işık Efekt Kartı") ----
// The panel is the card in edit mode: rooms on top with the selected room's lights joined below,
// tabs on the left, effects on the right. Everything moves by drag and drop.
const P_TXT = {
  tr: {
    title: 'Lemur Işık Efekt Kartı', undo: 'Geri al', undoK: 'Geri al (Ctrl+Z)', more: 'Diğer işlemler', settings: 'Ayarlar', settingsS: 'Görünüm, davranış, gece modu, kendi efektlerin',
    allHome: 'Tüm Ev', none: 'Diğer', hiddenRoom: 'Kartta gizli', addRoom: 'Oda', addRoomT: 'Işığı olmayan alanlar', addRoomNone: 'Işığı olmayan alan yok',
    lightsOf: '{r} ışıkları', allLights: 'Bütün ışıklar', hiddenLights: 'Kartta gizli ışıklar', noLight: 'Bu odada ışık yok', noHidden: 'Gizli ışık yok',
    allUses: 'Tüm Ev sekmesi evdeki bütün ışıkları kullanır', allOff: 'Tüm Ev kartta kapalı', allOffB: 'Tüm Ev’i kapat', offShort: 'kapalı', allOnB: 'Tüm Ev’i aç',
    addLight: 'Işık ekle', lHide: 'Kartta gizle', lBack: 'Asıl odasına geri al · {r}', lMove: 'Başka odaya taşı', addLightT: 'Işık ekle → {r}', searchL: 'Işık ara', fxN: '{n} efekt', noFxL: 'efektsiz', lOnly: 'Sadece ışık', fxUse: 'Efektlerde kullan', fxUseS: 'Kapalıyken yalnızca ton, renk ve parlaklık için kullanılır; efekt listesini etkilemez.', fxNone: 'Efekt desteklemiyor, sadece ışık', fxCnt: '{n} ışık · {f} efektte',
    why: { manual: 'elle gizlendi', segment: 'segment', indicator: 'gösterge LED’i', screen: 'tarayıcı ekranı', device: 'cihaz ışığı' },
    allFx: 'Tüm efektler', allFxS: '{n} efekt · ara, seç, sürükle', light: 'Işık', lightE: 'Beyaz ton, renk ve parlaklık. Bu sekme sabit, hep ilk sırada.',
    fav: 'Favoriler', hid: 'Gizli', addTab: 'Sekme ekle', emptyTab: 'Boş sekme', newTab: 'Yeni sekme', ready: 'Hazır', fromRooms: 'Diğer odalardan',
    edit: 'Düzenle', delTab: 'Sekmeyi sil', search: 'Efekt ara', dropHere: 'Efektleri buraya sürükle', noHidFx: 'Gizli efekt yok',
    hiddenRoomE: 'Buradaki ışıklar kartta hiç görünmez. Geri getirmek için üstteki bir odaya sürükle.', noLightE: 'Bu odada henüz ışık yok',
    noFxRoom: 'Bu odadaki ışıkların efekti yok. Işık sekmesi yine de çalışır.', selN: '{n} seçili', selHint: 'sürükleyip bir sekmeye bırak', clear: 'Seçimi bırak',
    reset: '{r}: otomatik düzene dön', roomOff: 'Odayı kartta gizle', roomOn: 'Odayı kartta göster', copyT: '{r} sekmelerini kopyala', copyAll: 'Bütün odalara',
    moved: '{x} → {r}', nLights: '{n} ışık', nFx: '{n} efekt', hiddenFx: '{x} bu odada gizlendi', shownFx: '{x} tekrar görünüyor', favAdd: '{x} favorilere eklendi',
    tabDel: '“{t}” silindi, efektleri Gizli’ye geçti', tabCopied: '“{t}” sekmesi kopyalandı → {r}', tabAdded: '“{t}” sekmesi eklendi', copied: 'Sekmeler kopyalandı → {r}',
    toRoom: '{r}', toAll: 'bütün odalar', resetDone: 'Otomatik düzene dönüldü', roomOffT: 'Oda kartta gizlendi', roomOnT: 'Oda kartta gösteriliyor',
    allOffT: 'Tüm Ev kartta kapalı', allOnT: 'Tüm Ev kartta açık', order: 'Sıra güncellendi', saved: 'Kaydedildi', undone: 'Geri alındı',
    fxMenu: 'Efekt ayrıntıları', namesOn: 'Işıklardaki adı', upIcon: 'Simge yükle', rmIcon: 'Varsayılan simge', hideFx: 'Bu odada gizle', showFx: 'Bu odada göster',
    addFav: 'Favorilere ekle', remFav: 'Favorilerden çıkar', iconSaved: 'Simge kaydedildi', iconErr: 'Simge yüklenemedi', close: 'Kapat',
    sCard: 'Kart', icColor: 'Renkli', icMono: 'Sade', defIcon: 'Varsayılan simge', searchI: 'Simge ara', lang: 'Dil', auto: 'Otomatik',
    sStop: 'Efekt durdurulunca', white: 'Beyaz ton', bright: 'Parlaklık', sAdv: 'Gelişmiş', thr: 'Efektli ışık sayılması için en az', thrS: 'Daha az efekti olan ışıklar sadece Işık sekmesinde görünür', thrN: '{n} efekt',
    local: 'Entegrasyon yüklenmemiş görünüyor; değişiklikler kaydedilemez.',
    sLook: 'Görünüm', tileSize: 'Karo boyutu', tsAuto: 'Otomatik', tsS: 'Küçük', tsM: 'Orta', tsL: 'Büyük',
    icStyle: 'Efekt simgeleri', icColorS: 'Renkli', icMonoS: 'Sade (tek renk)', showNames: 'Efekt adları', showNamesS: 'Kapalıyken karolarda sadece simge görünür',
    bg: 'Arka plan', bgDark: 'Koyu', bgBlack: 'Siyah (OLED)', bgTheme: 'Home Assistant teması', bgThemeS: 'Tema seçilirse kartın zemini ve yazıları Home Assistant temasını izler',
    showBar: 'Renk çizgisi', showBarS: 'Karoların altındaki renkli çizgi', showDots: 'Destek noktaları', showDotsS: 'Efekti kaç ışığın desteklediğini gösteren noktalar',
    sButtons: 'Alt çubuk', showStop: 'Durdur düğmesi', showRandom: 'Rastgele düğmesi', showRandomS: 'Geniş düzende görünür',
    sBehave: 'Davranış', fxOn: 'Kapalı ışıkta efekt seçilince', fxOnS: 'Işık bu parlaklıkta açılır', fxOnOff: 'Işığın kendi ayarı',
    startTab: 'Kart açılınca', stAuto: 'Otomatik', stFav: 'Favoriler', stLast: 'Son kullanılan', stLight: 'Işık',
    lp: 'Uzun basma süresi', lpS: 'Efekt menüsünü açmak için basılı tutma süresi', haptic: 'Titreşim', hapticS: 'Dokununca ve basılı tutunca (destekleyen telefonlarda)',
    sRooms: 'Odalar ve ışıklar', groups: 'Işık gruplarını da göster', groupsS: 'Home Assistant’taki ışık grupları ayrı bir ışık gibi listelenir',
    sNight: 'Gece modu', night: 'Gece modu', nightS: 'Bu saatler arasında parlaklık üst sınırı uygulanır (efektler, Durdur, parlaklık)', from: 'Başlangıç', to: 'Bitiş', nightMax: 'En fazla parlaklık',
    sMine: 'Kendi efektlerin', mineS: 'Bir efekt seç, onu desteklemeyen ışıklarda ne olacağını belirle; kartta normal bir efekt gibi görünür.', mineNew: 'Yeni efekt', mineNone: 'Henüz kendi efektin yok',
    sReset: 'Sıfırla', resetAll: 'Her şeyi sıfırla', resetAllS: 'Ayarlar, oda ve ışık düzeni, sekmeler, favoriler, gizlenenler, yüklenen simgeler ve kendi efektlerin silinir',
    resetQ: 'Her şey sıfırlansın mı?', resetW: 'Bu işlem ayarları, oda ve ışık düzenini, bütün sekmeleri, favorileri, gizlenen efektleri, yüklenen simgeleri ve kendi efektlerini siler. Evdeki bütün kartlar ilk kurulumdaki haline döner. Bu işlem geri alınamaz.',
    resetYes: 'Evet, her şeyi sıfırla', cancel: 'Vazgeç', resetOk: 'Her şey sıfırlandı',
    roomIcon: 'Oda simgesi', roomIconT: '{r} simgesi', mdiPh: 'mdi:simge-adi', apply: 'Uygula',
    script: 'Script olarak kaydet', scriptFav: 'Favorilerden script oluştur', scriptOk: '{n} script kaydedildi (Ayarlar → Otomasyonlar ve sahneler → Scriptler)', scriptErr: 'Script kaydedilemedi: {e}',
    editMine: 'Düzenle', delMine: 'Sil', mineDel: '“{x}” silindi',
    notHere: 'Bu efektin {r} odasında ışığı yok; önce efekte bu odadan bir ışık ekle', mineDrag: 'Sekmeye taşımak için sola, bir sekmenin üstüne sürükle',
    mineTab: 'Efekt oluştur', mineTabS: '{n} efektin · ışıkları sürükle', mineList: 'Kendi efektlerin', mineEmpty: 'Henüz kendi efektin yok. “Yeni efekt” ile başla: ışıkları sağa sürükle, her birinin ne yapacağını seç.', back: 'Geri',
    allL: 'Bütün ışıklar', allLS: 'Sürükle ya da + ile ekle', inFx: 'Bu efektteki ışıklar', inFxS: 'Buraya sürükle; her ışığın ne açacağını seç', dropL: 'Işıkları buraya sürükle', addAllR: 'Hepsini ekle', remL: 'Çıkar', allIn: 'Bütün ışıklar eklendi', fbDef: 'Otomatik ışıklar efekti desteklemiyorsa', nLin: '{n} ışık',
    ceTitle: 'Kendi efektin', ceName: 'Ad', ceIcon: 'Simge', ceBase: 'Temel efekt', ceBaseS: 'Destekleyen ışıklarda bu efekt oynar', ceNoBase: 'Yok, her ışık için kendim seçeceğim',
    ceFb: 'Desteklemeyen ışıklarda', ceFbS: 'Temel efekti olmayan ya da sadece ışık olarak kullanılan ışıklar', ceLights: 'Işık ışık', ceLightsS: 'İstersen tek tek değiştir',
    save: 'Kaydet', del: 'Sil', bri: 'Parlaklık', ceNameErr: 'Bir ad yaz', ceSaved: '“{x}” kaydedildi', ceHint: 'Kartta “Efektlerim” sekmesinde görünür.',
    m_auto: 'Otomatik', m_fx: 'Efekt', m_color: 'Renk', m_white: 'Beyaz', m_off: 'Kapat', m_skip: 'Dokunma', supBase: 'temel efekti oynatır', noBase: 'temel efekt yok', autoIs: 'otomatik: {x}',
    upd: 'Yeni sürüm yüklendi ({v}). Ekranı yenile.', reload: 'Yenile',
    pvB: 'Önizleme', pvT: 'Açıkken tıkladığın efekt ışıklarda hemen çalar', pvOn: 'Önizleme açık', pvWhere: 'tıkladığın efekt şu odanın ışıklarında çalar:', pvNow: 'şu an: {x}', pvBack: 'Eski haline dön', pvKeep: 'Böyle bırak', pvBackT: 'Işıklar önizlemeden önceki haline döndü', pvKeepT: 'Son efekt çalmaya devam ediyor', pvErr: 'Önizleme çalışmadı: {e}', pvNoRoom: 'Önizleme için bir oda seç',
    fade: 'Geçiş süresi', fadeS: 'Renk, beyaz, parlaklık ve kapatma yumuşak geçsin (destekleyen ışıklarda)', fadeNo: 'Yok',
    showRecent: 'Son kullanılanlar sekmesi', showRecentS: 'Odada son oynatılan efektler, Favoriler’in yanında',
    sBackup: 'Yedek', bkDown: 'Yedeği indir', bkDownS: 'Odalar, sekmeler, favoriler, kendi efektlerin, ayarlar ve simgeler tek dosyada',
    bkUp: 'Yedekten geri yükle', bkUpS: 'Bir yedek dosyası seç; şu anki düzenin yerine geçer', bkQ: 'Yedek geri yüklensin mi?',
    bkW: '{d} tarihli yedek. Şu anki odalar, sekmeler, favoriler, kendi efektlerin, ayarlar ve simgeler bu yedekle değiştirilir.',
    bkYes: 'Geri yükle', bkOk: 'Yedek geri yüklendi', bkErr: 'Bu dosya bir Lemur yedeği değil', bkSaved: 'Yedek indirildi', bkBusy: 'Yedek hazırlanıyor…',
    fillT: 'Eksik ışıkları tamamla', fillHead: '{x} · eksikleri tamamla', fillS: 'Bu efekti desteklemeyen ışıklar ne yapsın? Seçtiklerin efektle birlikte açılır, efekt böylece bütün odayı kaplar.',
    fillSup: 'Destekleyen ışıklar', fillMiss: 'Desteklemeyen ışıklar', fillAll: 'Hepsi için', fillAllS: 'Ayrıca seçmediğin her ışık bunu yapar',
    fillNone: 'Bu efekti evdeki bütün ışıklar destekliyor; tamamlanacak ışık yok.', fillSaved: '“{x}” tamamlandı', fillDel: 'Tamamlamayı kaldır', fillDeleted: '“{x}” için tamamlama kaldırıldı',
    m_def: 'Hepsi için seçilen', fillOn: 'Tamamlanmış', fillTag: 'tamamlandı', fillNoEff: 'efekti var ama efektlerde kullanılmıyor'
  },
  en: {
    title: 'Lemur Light Effect Card', undo: 'Undo', undoK: 'Undo (Ctrl+Z)', more: 'More', settings: 'Settings', settingsS: 'Appearance, behaviour, night mode, your own effects',
    allHome: 'Whole home', none: 'Unassigned', hiddenRoom: 'Hidden in card', addRoom: 'Room', addRoomT: 'Areas without lights', addRoomNone: 'No areas without lights',
    lightsOf: '{r} lights', allLights: 'All lights', hiddenLights: 'Lights hidden in the card', noLight: 'No lights in this room', noHidden: 'No hidden lights',
    allUses: 'The Whole home tab uses every light at home', allOff: 'Whole home is off in the card', allOffB: 'Turn Whole home off', offShort: 'off', allOnB: 'Turn Whole home on',
    addLight: 'Add light', lHide: 'Hide in the card', lBack: 'Back to its own room · {r}', lMove: 'Move to another room', addLightT: 'Add light → {r}', searchL: 'Search lights', fxN: '{n} effects', noFxL: 'no effects', lOnly: 'Light only', fxUse: 'Use for effects', fxUseS: 'When off it is used only for tone, colour and brightness and does not affect the effect list.', fxNone: 'No effect support, light only', fxCnt: '{n} lights · {f} for effects',
    why: { manual: 'hidden by you', segment: 'segment', indicator: 'indicator LED', screen: 'browser screen', device: 'device light' },
    allFx: 'All effects', allFxS: '{n} effects · drag onto tabs', light: 'Light', lightE: 'White tone, color and brightness. This tab is fixed and always first.',
    fav: 'Favorites', hid: 'Hidden', addTab: 'Add tab', emptyTab: 'Empty tab', newTab: 'New tab', ready: 'Ready-made', fromRooms: 'From other rooms',
    edit: 'Edit', delTab: 'Delete tab', search: 'Search effects', dropHere: 'Drag effects here', noHidFx: 'No hidden effects',
    hiddenRoomE: 'These lights never show in the card. Drag one onto a room above to bring it back.', noLightE: 'No lights in this room yet',
    noFxRoom: 'The lights in this room have no effects. The Light tab still works.', selN: '{n} selected', selHint: 'drag them onto a tab', clear: 'Clear selection',
    reset: '{r}: back to automatic layout', roomOff: 'Hide room in the card', roomOn: 'Show room in the card', copyT: 'Copy {r} tabs to', copyAll: 'Every room',
    moved: '{x} → {r}', nLights: '{n} lights', nFx: '{n} effects', hiddenFx: '{x} hidden in this room', shownFx: '{x} is shown again', favAdd: '{x} added to favorites',
    tabDel: '“{t}” deleted, its effects moved to Hidden', tabCopied: '“{t}” tab copied → {r}', tabAdded: '“{t}” tab added', copied: 'Tabs copied → {r}',
    toRoom: '{r}', toAll: 'every room', resetDone: 'Back to the automatic layout', roomOffT: 'Room hidden in the card', roomOnT: 'Room shown in the card',
    allOffT: 'Whole home is off in the card', allOnT: 'Whole home is on in the card', order: 'Order updated', saved: 'Saved', undone: 'Undone',
    fxMenu: 'Effect details', namesOn: 'Name on each light', upIcon: 'Upload icon', rmIcon: 'Default icon', hideFx: 'Hide in this room', showFx: 'Show in this room',
    addFav: 'Add to favorites', remFav: 'Remove from favorites', iconSaved: 'Icon saved', iconErr: 'Could not upload icon', close: 'Close',
    sCard: 'Card', icColor: 'Colour', icMono: 'Simple', defIcon: 'Default icon', searchI: 'Search icons', lang: 'Language', auto: 'Automatic',
    sStop: 'When an effect is stopped', white: 'White tone', bright: 'Brightness', sAdv: 'Advanced', thr: 'Minimum effects to count as an effect light', thrS: 'Lights with fewer effects only appear in the Light tab', thrN: '{n} effects',
    local: 'The integration does not seem to be loaded; changes cannot be saved.',
    sLook: 'Appearance', tileSize: 'Tile size', tsAuto: 'Automatic', tsS: 'Small', tsM: 'Medium', tsL: 'Large',
    icStyle: 'Effect icons', icColorS: 'Colour', icMonoS: 'Simple (one colour)', showNames: 'Effect names', showNamesS: 'When off, tiles show only the icon',
    bg: 'Background', bgDark: 'Dark', bgBlack: 'Black (OLED)', bgTheme: 'Home Assistant theme', bgThemeS: 'With theme, the card background and text follow your Home Assistant theme',
    showBar: 'Colour line', showBarS: 'The coloured line under tiles', showDots: 'Support dots', showDotsS: 'Dots showing how many lights support an effect',
    sButtons: 'Bottom bar', showStop: 'Stop button', showRandom: 'Random button', showRandomS: 'Shown in the wide layout',
    sBehave: 'Behaviour', fxOn: 'When an effect is picked for a light that is off', fxOnS: 'The light comes on at this brightness', fxOnOff: 'Light’s own setting',
    startTab: 'When the card opens', stAuto: 'Automatic', stFav: 'Favorites', stLast: 'Last used', stLight: 'Light',
    lp: 'Long press time', lpS: 'How long to hold to open the effect menu', haptic: 'Vibration', hapticS: 'On tap and long press (on phones that support it)',
    sRooms: 'Rooms and lights', groups: 'Also show light groups', groupsS: 'Light groups from Home Assistant are listed like a light',
    sNight: 'Night mode', night: 'Night mode', nightS: 'Between these times brightness is capped (effects, Stop, brightness)', from: 'From', to: 'To', nightMax: 'Maximum brightness',
    sMine: 'Your own effects', mineS: 'Pick an effect, choose what lights without it do, and it shows in the card like any other effect.', mineNew: 'New effect', mineNone: 'No effects of your own yet',
    sReset: 'Reset', resetAll: 'Reset everything', resetAllS: 'Settings, room and light layout, tabs, favorites, hidden effects, uploaded icons and your own effects are deleted',
    resetQ: 'Reset everything?', resetW: 'This deletes the settings, the room and light layout, every tab, favorites, hidden effects, uploaded icons and your own effects. Every card at home goes back to how it was after installing. This cannot be undone.',
    resetYes: 'Yes, reset everything', cancel: 'Cancel', resetOk: 'Everything was reset',
    roomIcon: 'Room icon', roomIconT: '{r} icon', mdiPh: 'mdi:icon-name', apply: 'Apply',
    script: 'Save as script', scriptFav: 'Make scripts from favorites', scriptOk: '{n} scripts saved (Settings → Automations & scenes → Scripts)', scriptErr: 'Could not save the script: {e}',
    editMine: 'Edit', delMine: 'Delete', mineDel: '“{x}” deleted',
    notHere: 'This effect has no light in {r}; add a light from this room to the effect first', mineDrag: 'Drag onto a tab on the left to move it there',
    mineTab: 'Create effect', mineTabS: '{n} effects · drag lights', mineList: 'Your own effects', mineEmpty: 'No effects of your own yet. Start with “New effect”: drag lights to the right and choose what each one does.', back: 'Back',
    allL: 'All lights', allLS: 'Drag, or add with +', inFx: 'Lights in this effect', inFxS: 'Drag here, then choose what each light does', dropL: 'Drag lights here', addAllR: 'Add all', remL: 'Remove', allIn: 'Every light is in', fbDef: 'If an automatic light lacks the base effect', nLin: '{n} lights',
    ceTitle: 'Your own effect', ceName: 'Name', ceIcon: 'Icon', ceBase: 'Base effect', ceBaseS: 'Lights that have it play this effect', ceNoBase: 'None, I will choose for each light',
    ceFb: 'Lights without it', ceFbS: 'Lights without the base effect, or used for light only', ceLights: 'Light by light', ceLightsS: 'Change any light if you like',
    save: 'Save', del: 'Delete', bri: 'Brightness', ceNameErr: 'Type a name', ceSaved: '“{x}” saved', ceHint: 'It shows in the card under “My effects”.',
    m_auto: 'Automatic', m_fx: 'Effect', m_color: 'Colour', m_white: 'White', m_off: 'Turn off', m_skip: 'Leave as is', supBase: 'plays the base effect', noBase: 'no base effect', autoIs: 'automatic: {x}',
    upd: 'A new version is installed ({v}). Reload the page.', reload: 'Reload',
    pvB: 'Preview', pvT: 'While it is on, the effect you click plays on the lights right away', pvOn: 'Preview on', pvWhere: 'the effect you click plays on the lights of:', pvNow: 'now: {x}', pvBack: 'Put lights back', pvKeep: 'Keep it', pvBackT: 'The lights are back as they were before the preview', pvKeepT: 'The last effect keeps playing', pvErr: 'Preview did not work: {e}', pvNoRoom: 'Pick a room for the preview',
    fade: 'Transition', fadeS: 'Colour, white, brightness and turning off change softly (lights that support it)', fadeNo: 'None',
    showRecent: 'Recently used tab', showRecentS: 'Effects played lately in the room, next to Favorites',
    sBackup: 'Backup', bkDown: 'Download backup', bkDownS: 'Rooms, tabs, favorites, your own effects, settings and icons in one file',
    bkUp: 'Restore a backup', bkUpS: 'Pick a backup file; it replaces the current setup', bkQ: 'Restore this backup?',
    bkW: 'Backup from {d}. The current rooms, tabs, favorites, your own effects, settings and icons are replaced by it.',
    bkYes: 'Restore', bkOk: 'Backup restored', bkErr: 'This file is not a Lemur backup', bkSaved: 'Backup downloaded', bkBusy: 'Preparing the backup…',
    fillT: 'Fill in the missing lights', fillHead: '{x} · fill in the missing lights', fillS: 'What should lights without this effect do? What you pick comes on together with the effect, so it covers the whole room.',
    fillSup: 'Lights with it', fillMiss: 'Lights without it', fillAll: 'For all', fillAllS: 'Every light you do not set on its own does this',
    fillNone: 'Every light at home has this effect; nothing to fill in.', fillSaved: '“{x}” filled in', fillDel: 'Remove filling in', fillDeleted: 'Filling in removed for “{x}”',
    m_def: 'What “For all” says', fillOn: 'Filled in', fillTag: 'filled in', fillNoEff: 'has it but is not used for effects'
  }
};
const PI = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  homes: '<path d="M2 11l7-5.5 7 5.5"/><path d="M4 10v9h10v-9"/><path d="M13 6.5l3-2.5 6 5v10h-5"/>',
  inbox: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 2h6l1-2h5"/>',
  sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.7-1.3"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  star: '<path fill="currentColor" d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  more: '<circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/>',
  reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  drag: '<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
  script: '<path d="M8 4h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7"/><path d="M8 4a2 2 0 0 0-2 2v12a2 2 0 0 1-2 2"/><path d="M10 9h6M10 13h6"/>',
  wand: '<path d="M4 20L15 9"/><path d="M15 4v3M19 8h-3M18.5 4.5l-2 2"/>',
  download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
  play: '<path fill="currentColor" stroke="none" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/>'
};
// room icons offered in the panel (any mdi: name can be typed too)
const ROOM_ICONS = ['mdi:sofa', 'mdi:sofa-outline', 'mdi:bed', 'mdi:bed-king', 'mdi:bed-single', 'mdi:desk', 'mdi:laptop', 'mdi:monitor', 'mdi:silverware-fork-knife', 'mdi:stove', 'mdi:fridge', 'mdi:coffee', 'mdi:shower', 'mdi:bathtub', 'mdi:toilet', 'mdi:television', 'mdi:gamepad-variant', 'mdi:teddy-bear', 'mdi:baby-carriage', 'mdi:wardrobe', 'mdi:washing-machine', 'mdi:garage', 'mdi:car', 'mdi:tree', 'mdi:flower', 'mdi:balcony', 'mdi:door', 'mdi:stairs', 'mdi:home', 'mdi:home-floor-1', 'mdi:home-floor-2', 'mdi:home-roof', 'mdi:dumbbell', 'mdi:book-open-variant', 'mdi:music', 'mdi:lamp', 'mdi:ceiling-light', 'mdi:led-strip-variant', 'mdi:lightbulb-group', 'mdi:fireplace', 'mdi:pool', 'mdi:paw'];
const rgbHex = a => '#' + (Array.isArray(a) ? a : [255, 140, 60]).map(v => Math.max(0, Math.min(255, +v || 0)).toString(16).padStart(2, '0')).join('');
const hsl2rgb = (h, s, l) => { s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return [f(0), f(8), f(4)].map(v => Math.round(v * 255)); };
const hexRgb = h => [1, 3, 5].map(i => parseInt(String(h).slice(i, i + 2), 16) || 0);
const slug = s => String(s).toLocaleLowerCase('tr').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').normalize('NFKD').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'x';
const pi = (n, c = 's') => `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${PI[n]}</svg>`;
// what a dragged item may be dropped on
const DND_ACCEPT = { light: ['room', 'strip'], fx: ['tab'], tab: ['tab', 'room'], room: ['room'], cl: ['cz'] };
const newId = () => 't' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
const clone = o => JSON.parse(JSON.stringify(o == null ? null : o));

class LemurLightEffectsPanel extends HTMLElement {
  constructor() {
    super();
    this._room = null; this._tab = {}; this._pick = new Set(); this._last = null; this._view = 'edit'; this._undo = []; this._q = '';
    // the server echoes every save back; only re-render when something really changed, and never under an open popover or a drag
    this._onStore = () => { if (this._dataSig() !== this._lastData) this._later(); };
    this._pm = e => this._dmove(e); this._pu = () => this._dup();
    this._tm = e => { if (this._dd && this._dd.on) e.preventDefault(); };
    this._kd = e => this._key(e);
  }
  _fillFromUrl() {
    let k = null, r = null; try { const q = new URLSearchParams(location.search); k = q.get('fill'); r = q.get('room'); } catch (e) {}
    if (!k || !this._hass) return;
    try { history.replaceState(history.state, '', location.pathname); } catch (e) {}
    this._fillOpen(k, r);
  }
  connectedCallback() {
    this._lc = this._lc || (() => setTimeout(() => this._fillFromUrl(), 50)); window.addEventListener('location-changed', this._lc);
    setTimeout(() => this._fillFromUrl(), 200);
    STORE.L.add(this._onStore);
    window.addEventListener('pointermove', this._pm, { passive: false });
    window.addEventListener('pointerup', this._pu); window.addEventListener('pointercancel', this._pu);
    window.addEventListener('touchmove', this._tm, { passive: false });
    window.addEventListener('keydown', this._kd);
    this._render();
  }
  disconnectedCallback() {
    if (this._pv) this._pvEnd(true, true);
    window.removeEventListener('location-changed', this._lc);
    STORE.L.delete(this._onStore);
    window.removeEventListener('pointermove', this._pm); window.removeEventListener('pointerup', this._pu);
    window.removeEventListener('pointercancel', this._pu); window.removeEventListener('touchmove', this._tm);
    window.removeEventListener('keydown', this._kd);
  }
  set narrow(v) { const c = this._narrow !== v; this._narrow = v; if (this._mb) this._mb.narrow = v; if (c && this._hass) this._render(); }
  set panel(v) { this._panel = v; }
  set route(v) { this._route = v; }
  set hass(h) {
    const first = !this._hass; this._hass = h; STORE.attach(h);
    if (this._mb) this._mb.hass = h;
    const sig = this._sig();
    if (first) this._render(); else if (sig !== this._lastSig) this._later();
  }
  _dataSig() { const d = STORE.d; return JSON.stringify([d.settings, d.tabs, d.icons, d.favorites, d.hidden, STORE.mode, ICON3_OK]); }
  _later() {
    if (this._dd || this._ce || (this.shadowRoot && this.shadowRoot.querySelector('.pop'))) { this._pend = true; return; }
    this._render();
  }
  _l() { const s = this._set().language; if (s && I18N[s]) return s; const h = this._hass; return pickLang((h && ((h.locale && h.locale.language) || h.language)) || 'en'); }
  _t(k, v) { const T = P_TXT[this._l()]; let s = T[k] != null ? T[k] : P_TXT.en[k]; if (typeof s === 'string' && v) for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s; }
  _hi(icon, fb) { return customElements.get('ha-icon') && icon ? `<ha-icon icon="${esc(icon)}"></ha-icon>` : fb; }
  _set() { const s = STORE.d.settings; return s && typeof s === 'object' ? s : {}; }
  _sig() {
    const H = this._hass; if (!H) return '';
    let s = (H.entities ? Object.keys(H.entities).length : 0) + '|' + (H.areas ? Object.keys(H.areas).length : 0) + '|';
    for (const id in H.states) if (id.startsWith('light.')) { const x = H.states[id], l = x.attributes.effect_list; s += id + x.state + (l ? l.length : 0) + ','; }
    return s;
  }

  // ---- undo: every change keeps a copy of settings and tabs from before ----
  _snap() { this._undo.push({ settings: clone(this._set()), tabs: clone(STORE.d.tabs || {}) }); if (this._undo.length > 40) this._undo.shift(); }
  _undoIt() {
    const u = this._undo.pop(); if (!u) return;
    STORE.set('settings', u.settings); STORE.set('tabs', u.tabs); this._pick.clear(); this._toast(this._t('undone'), false);
  }
  _save(patch, msg) {
    this._snap();
    const n = Object.assign({}, this._set(), patch);
    Object.keys(n).forEach(k => { if (n[k] == null) delete n[k]; });
    STORE.set('settings', n); if (msg !== false) this._toast(msg || this._t('saved'));
  }

  // ---- lights and rooms ----
  _minFx() { return +(this._set().min_effects || 3); }
  _fxOn(id) { return fxOn(this._set(), id, this._fxCount(id)); }
  _fxCount(id) { const l = this._hass.states[id] && this._hass.states[id].attributes.effect_list; return Array.isArray(l) ? parseList(l).m.size : 0; }
  _name(id) { const s = this._hass.states[id]; return (s && s.attributes.friendly_name) || id; }
  _roomName(id) {
    if (id === '_all') return this._t('allHome'); if (id === '_none') return this._t('none'); if (id === '_hidden') return this._t('hiddenRoom');
    const a = (this._hass.areas || {})[id]; return a ? a.name : id;
  }
  _model() {
    const H = this._hass, A = H.areas || {}, S = this._set(), lang = this._l(), by = {}, hidden = [];
    for (const id of lightPool(H, !!S.include_groups)) {
      const p = lightPlace(H, S, id);
      if (!p.room) hidden.push({ id, why: p.why }); else (by[p.room] = by[p.room] || []).push(id);
    }
    const cmp = (a, b) => this._name(a).localeCompare(this._name(b), lang);
    Object.values(by).forEach(l => l.sort(cmp)); hidden.sort((a, b) => cmp(a.id, b.id));
    const ok = a => a === '_all' || (a === '_none' ? !!by._none : !!by[a] || (this._extra && this._extra === a && !!A[a]));
    const pref = (S.order || []).filter(ok);
    const rest = Object.keys(by).filter(a => a !== '_none' && !pref.includes(a)).sort((a, b) => A[a].name.localeCompare(A[b].name, lang));
    let order = [...pref, ...rest];
    if (by._none && !order.includes('_none')) order.push('_none');
    if (this._extra && A[this._extra] && !order.includes(this._extra)) order.push(this._extra);
    if (!order.includes('_all')) order.unshift('_all');
    const real = order.filter(a => a !== '_all');
    if (real.length < 2) order = real;
    const why = {}; hidden.forEach(h => { why[h.id] = h.why; });
    const empty = Object.values(A).filter(a => !by[a.area_id] && a.area_id !== this._extra).sort((a, b) => a.name.localeCompare(b.name, lang));
    return { by, hidden: hidden.map(h => h.id), why, order, empty };
  }
  _lightsOf(M, rid) {
    if (rid === '_all') return M.order.filter(a => a !== '_all').flatMap(a => M.by[a] || []);
    if (rid === '_hidden') return M.hidden;
    return M.by[rid] || [];
  }
  _roomOf(M, id) { if (M.hidden.includes(id)) return '_hidden'; return Object.keys(M.by).find(r => M.by[r].includes(id)) || null; }
  _homeOf(id) { return lightPlace(this._hass, { layout: {}, exclude: [], include: [] }, id).room || '_none'; }

  // effects of a room: key → { k, names: { light: name }, c, rep }
  _effects(L) {
    const U = new Map();
    for (const id of L) {
      if (!this._fxOn(id)) continue;
      for (const [k, n] of parseList(this._hass.states[id].attributes.effect_list).m) {
        let u = U.get(k); if (!u) { u = { k, names: {}, c: 0, rep: n }; U.set(k, u); }
        u.names[id] = n; u.c++; if (GOVL.has(n) && !GOVL.has(u.rep)) u.rep = n;
      }
    }
    customUnits(this._set(), this._hass, L, id => this._fxOn(id)).forEach(u => U.set(u.k, u));
    return U;
  }
  _grp(U) { return k => grpOfKey(k, (U.get(k) || { rep: k }).rep); }
  _resolve(rid, U) { return resolveTabs(roomCfg(this._set(), rid), [...U.keys()], this._grp(U)); }
  _label(u) { if (u.label) return u.label; const i = fxInfo(u.rep); return this._l() === 'tr' && i.tr ? i.tr : pretty(u.rep); }
  _ico(u, px) { return fxArt(u, px, this._set()); }
  _tabName(t) { return t.name || (t.fav ? this._t('fav') : GNAME[this._l()][t.auto] || t.id); }
  _tabIcon(t) { return tabArt(t); }
  _lightIcon(rid) { return (roomCfg(this._set(), rid || this._room) || {}).light_icon || ''; }
  _lightDot(id) {
    const s = this._hass.states[id], a = (s && s.attributes) || {}, on = s && s.state === 'on';
    const bg = on && a.rgb_color ? `rgb(${a.rgb_color.join(',')})` : on && a.color_mode === 'color_temp' ? 'linear-gradient(140deg,#FFD9A8,#FFB86E)' : grad([hashHue(id), (hashHue(id) + 50) % 360], 70, 62, '135deg');
    return `<span class="dot ${on ? '' : 'off'}" style="background:${bg}">${pi('bulb')}</span>`;
  }
  _toast(x, undo = true) {
    this._tst = { x, undo, until: Date.now() + 4200 }; this._showToast();
  }
  _showToast() {
    const el = this.shadowRoot && this.shadowRoot.querySelector('.toast'), T = this._tst; if (!el || !T) return;
    const left = T.until - Date.now(); if (left <= 0) { this._tst = null; return; }
    el.querySelector('span').textContent = T.x; el.querySelector('button').hidden = !T.undo || !this._undo.length;
    el.classList.add('show'); clearTimeout(this._tt); this._tt = setTimeout(() => { const e2 = this.shadowRoot.querySelector('.toast'); if (e2) e2.classList.remove('show'); this._tst = null; }, left);
  }

  // ---- edits of a room's tabs ----
  _edit(rid, fn, msg) {
    const M = this._M, U = this._effects(this._lightsOf(M, rid));
    const cfg = materialize(this._set(), rid, [...U.keys()], this._grp(U));
    cfg.tabs.forEach(t => { t.fx = t.fx || []; }); cfg.hid = cfg.hid || [];
    if (fn(cfg, U) === false) return;
    this._snap(); saveRoomCfg(rid, cfg); this._pick.clear();
    if (msg) this._toast(msg);
  }
  _nameFx(U, ids) { return ids.length > 1 ? this._t('nFx', { n: ids.length }) : this._label(U.get(ids[0]) || { rep: ids[0] }); }
  _moveFx(ids, to, before, src) {
    const rid = this._room;
    this._edit(rid, (cfg, U) => {
      const fav = cfg.tabs.find(t => t.fav), ins = (arr, keys) => { const L = arr.filter(k => !keys.includes(k)); let i = before ? L.indexOf(before) : -1; if (i < 0) i = L.length; L.splice(i, 0, ...keys); return L; };
      if (to === '_hid') {
        cfg.tabs.forEach(t => { t.fx = t.fx.filter(k => !ids.includes(k)); }); cfg.hid = [...cfg.hid.filter(k => !ids.includes(k)), ...ids];
        this._msg = this._t('hiddenFx', { x: this._nameFx(U, ids) }); return;
      }
      const t = cfg.tabs.find(x => x.id === to); if (!t) return false;
      cfg.hid = cfg.hid.filter(k => !ids.includes(k));
      if (t.fav) {
        t.fx = ins(t.fx, ids);
        // an effect that was hidden needs a tab of its own too
        const grp = this._grp(U);
        ids.forEach(k => { if (!cfg.tabs.some(x => !x.fav && x.fx.includes(k))) { const g = cfg.tabs.find(x => !x.fav && x.auto === grp(k)) || cfg.tabs.find(x => !x.fav); if (g) g.fx.push(k); } });
      } else {
        cfg.tabs.forEach(x => { if (!x.fav) x.fx = x.fx.filter(k => !ids.includes(k)); });
        if (src && fav && src === fav.id) fav.fx = fav.fx.filter(k => !ids.includes(k));
        t.fx = ins(t.fx, ids);
      }
      this._msg = this._t('moved', { x: this._nameFx(U, ids), r: this._tabName(t) });
    });
    if (this._msg) { this._toast(this._msg); this._msg = null; }
  }
  _moveLights(ids, to) {
    const M = this._M; ids = ids.filter(id => this._roomOf(M, id) !== to); if (!ids.length || to === '_all') return this._render();
    const S = this._set(), L = Object.assign({}, S.layout || {}), X = new Set(S.exclude || []), I = new Set(S.include || []);
    for (const id of ids) {
      X.delete(id); I.delete(id); delete L[id];
      const def = lightPlace(this._hass, { layout: {}, exclude: [...X], include: [...I] }, id).room || '_hidden';
      if (def !== to) L[id] = to;
    }
    this._pick.clear();
    if (this._extra === to) this._extra = null;
    this._save({ layout: L, exclude: X.size ? [...X] : null, include: I.size ? [...I] : null, layout_v2: true }, this._t('moved', { x: ids.length > 1 ? this._t('nLights', { n: ids.length }) : this._name(ids[0]), r: this._roomName(to) }));
  }
  _copyTab(src, rid, U) {
    // src is a resolved tab of another room; only the effects this room has come along
    this._edit(rid, (cfg, U2) => {
      const add = src.fx.filter(k => U2.has(k));
      if (src.fav) { let f = cfg.tabs.find(t => t.fav); if (!f) { f = { id: 'fav', fav: 1, fx: [] }; cfg.tabs.unshift(f); } add.forEach(k => { if (!f.fx.includes(k)) f.fx.push(k); }); cfg.hid = cfg.hid.filter(k => !add.includes(k)); return; }
      const nm = this._tabName(src).toLocaleLowerCase(this._l());
      let t = cfg.tabs.find(x => !x.fav && this._tabName(x).toLocaleLowerCase(this._l()) === nm);
      cfg.tabs.forEach(x => { if (!x.fav && x !== t) x.fx = x.fx.filter(k => !add.includes(k)); });
      cfg.hid = cfg.hid.filter(k => !add.includes(k));
      if (!t) { t = { id: newId(), fx: [] }; ['name', 'icon', 'auto'].forEach(f => { if (src[f] != null) t[f] = src[f]; }); if (!t.name) t.name = this._tabName(src); cfg.tabs.push(t); }
      add.forEach(k => { if (!t.fx.includes(k)) t.fx.push(k); });
      cfg.tabs = cfg.tabs.filter(x => x.fav || x.fx.length || x === t);
      this._newTab = t.id;
    });
  }
  _drop(type, ids, kind, to, before, src) {
    const M = this._M;
    if (type === 'light') return this._moveLights(ids, kind === 'strip' ? (to === '_all' ? null : to) || this._room : to);
    if (type === 'fx') {
      // an own effect can only sit in a tab of a room that has one of its lights
      const ok = ids.filter(k => this._U && this._U.has(k));
      if (!ok.length) { this._render(); return this._toast(this._t('notHere', { r: this._roomName(this._room) }), false); }
      return this._moveFx(ok, to, before, src);
    }
    if (type === 'cl') return this._ceMove(ids, to === 'in');
    if (type === 'tab' && kind === 'tab') {
      if (to === '_hid' || to === ids[0]) return this._render();
      return this._edit(this._room, cfg => { const T = cfg.tabs, a = T.findIndex(t => t.id === ids[0]); if (a < 0) return false; const [m] = T.splice(a, 1); let i = T.findIndex(t => t.id === to); if (i < 0) i = T.length; T.splice(i, 0, m); }, this._t('order'));
    }
    if (type === 'tab' && kind === 'room') {
      if (to === this._room || to === '_hidden') return this._render();
      const U = this._effects(this._lightsOf(M, this._room)), src = this._resolve(this._room, U).tabs.find(t => t.id === ids[0]); if (!src) return;
      this._copyTab(src, to); return this._toast(this._t('tabCopied', { t: this._tabName(src), r: this._roomName(to) }));
    }
    if (type === 'room' && kind === 'room') {
      if (to === ids[0] || to === '_hidden') return this._render();
      const O = M.order.filter(a => a !== ids[0]); let i = O.indexOf(to); if (i < 0) i = O.length; O.splice(i, 0, ids[0]);
      return this._save({ order: O }, this._t('order'));
    }
  }
  _roomVis(rid) {
    const S = this._set(), H = new Set(S.hidden_areas || []);
    if (rid === '_all') {
      const on = allHomeOn(S);
      if (on) H.add('_all'); else H.delete('_all');
      return this._save({ hidden_areas: [...H], all_home: null }, this._t(on ? 'allOffT' : 'allOnT'));
    }
    const was = H.has(rid); was ? H.delete(rid) : H.add(rid);
    this._save({ hidden_areas: [...H] }, this._t(was ? 'roomOnT' : 'roomOffT'));
  }

  // ---- preview: tapped effects play on the room's lights; the integration remembers and restores them ----
  _pvWs(m) { return this._hass.connection.sendMessagePromise(Object.assign({ type: 'lemur_light_effects/preview' }, m)); }
  async _pvRoom(room) {
    if (!room || room === '_hidden') { if (this._pv) await this._pvEnd(true); else this._toast(this._t('pvNoRoom'), false); return; }
    const was = this._pv;
    this._pv = { room, key: null }; this._render();
    try { await this._pvWs({ action: 'start', room }); }
    catch (e) { this._pv = was && was.room !== room ? null : was; this._render(); this._toast(this._t('pvErr', { e: (e && e.message) || e }), false); }
  }
  _pvPlay(k) {
    if (!this._pv) return;
    this._pv.key = k; this._render();
    // quick clicks in a row: only the last one goes to the lights
    clearTimeout(this._pvT);
    this._pvT = setTimeout(async () => {
      const pv = this._pv; if (!pv || pv.key !== k) return;
      try { await this._pvWs({ action: 'play', room: pv.room, effect: k }); }
      catch (e) { this._toast(this._t('pvErr', { e: (e && e.message) || e }), false); }
    }, 250);
  }
  async _pvEnd(restore, quiet) {
    if (!this._pv) return;
    clearTimeout(this._pvT); this._pv = null;
    if (!quiet) this._render();
    try { await this._pvWs({ action: 'end', restore: !!restore }); if (!quiet) this._toast(this._t(restore ? 'pvBackT' : 'pvKeepT'), false); }
    catch (e) { if (!quiet) this._toast(this._t('pvErr', { e: (e && e.message) || e }), false); }
  }

  // ---- render ----
  _render() {
    if (!this._hass) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const R = this.shadowRoot, t = (k, v) => this._t(k, v), S = this._set();
    this._lastSig = this._sig(); this._lastData = this._dataSig(); this._pend = false;
    const keep = [...R.querySelectorAll('.grid,.tscroll,.rooms')].map(el => [el.scrollTop, el.scrollLeft]), od = R.querySelector('.dlg'), dlgTop = od ? od.scrollTop : 0, dlgView = this._dlgView;
    const ae = R.activeElement, af = ae && ae.id, ss = ae && ae.selectionStart;
    const M = this._model(); this._M = M;
    const ids = [...M.order, '_hidden'];
    if (!ids.includes(this._room)) this._room = M.order.find(a => a !== '_all') || M.order[0] || '_hidden';
    const rid = this._room, hidR = rid === '_hidden', offR = new Set(S.hidden_areas || []);
    const L = this._lightsOf(M, rid), U = hidR ? new Map() : this._effects(L), RES = hidR ? { tabs: [], hid: [] } : this._resolve(rid, U);
    this._U = U; this._RES = RES;
    let tid = this._tab[rid];
    if (tid !== '_light' && tid !== '_hid' && tid !== '_allfx' && tid !== '_mine' && !RES.tabs.some(x => x.id === tid)) tid = this._tab[rid] = U.size ? '_allfx' : (RES.tabs[0] || { id: '_light' }).id;
    if (this._newTab && RES.tabs.some(x => x.id === this._newTab)) { tid = this._tab[rid] = this._newTab; }
    this._newTab = null;
    const isOff = id => id === '_all' ? !allHomeOn(S) : offR.has(id);

    // rooms + attached light strip
    const rb = id => {
      const ord = id !== '_hidden', RI = S.room_icons || {}, ic = id === '_hidden' ? pi('eyeoff', 's20') : RI[id] ? this._hi(RI[id], pi('home', 's20')) : id === '_all' ? pi('homes', 's20') : id === '_none' ? pi('inbox', 's20') : this._hi(((this._hass.areas || {})[id] || {}).icon, pi('home', 's20'));
      const n = id === '_all' ? null : this._lightsOf(M, id).length;
      return `<div class="rb ${rid === id ? 'on' : ''} ${isOff(id) ? 'off' : ''} ${id === '_hidden' ? 'hid' : ''}" data-room="${esc(id)}" ${ord ? `data-d="room|${esc(id)}" data-label="${esc(this._roomName(id))}"` : ''} data-z="room|${esc(id)}">
        ${ic}${esc(this._roomName(id))}${n != null ? `<em>${n}</em>` : isOff(id) ? `<em>${esc(t('offShort'))}</em>` : ''}</div>`;
    };
    const rooms = `<div class="rooms">${M.order.map(rb).join('')}<button class="rb add" data-addroom title="${esc(t('addRoomT'))}">${pi('plus', 's16')}${esc(t('addRoom'))}</button><span class="sp"></span>${rb('_hidden')}</div>`;
    const chip = id => {
      const home = this._homeOf(id), cur = this._roomOf(M, id), mv = cur !== '_hidden' && home !== cur && !(home === '_none' && cur === '_none'), n = this._fxCount(id);
      const on = this._fxOn(id), sub = cur === '_hidden' ? (t('why')[M.why[id]] || '') : on ? t('fxN', { n }) : t('lOnly');
      const out = cur === '_hidden' ? t('lBack', { r: this._roomName(home) }) : mv ? t('lBack', { r: this._roomName(home) }) : t('lHide');
      return `<div class="lt ${mv ? 'mv' : ''} ${on || cur === '_hidden' ? '' : 'lo'}" data-d="light|${esc(id)}" data-lmenu="${esc(id)}" data-label="${esc(this._name(id))}" title="${esc(id)}">${this._lightDot(id)}<span class="tx"><b>${esc(this._name(id))}</b><small>${esc(sub)}</small></span>
        <button class="lx" data-lout="${esc(id)}" title="${esc(out)}" aria-label="${esc(out)}">${pi(cur === '_hidden' || mv ? 'undo' : 'x', 's14')}</button></div>`;
    };
    const first = M.order[0] === rid;
    const head = rid === '_all' ? t('allLights') : hidR ? t('hiddenLights') : t('lightsOf', { r: this._roomName(rid) });
    let stripBody;
    if (rid === '_all') stripBody = `<span class="lnone">${esc(isOff('_all') ? t('allOff') : t('allUses'))}</span><span class="grow"></span><button class="offb ${isOff('_all') ? 'is' : ''}" data-roff>${pi(isOff('_all') ? 'eye' : 'eyeoff', 's16')}${esc(isOff('_all') ? t('allOnB') : t('allOffB'))}</button>`;
    else stripBody = (L.map(chip).join('') || `<span class="lnone">${esc(hidR ? t('noHidden') : t('noLight'))}</span>`) + (hidR ? '' : `<button class="addl" data-addlight>${pi('plus', 's16')}${esc(t('addLight'))}</button>`);
    const strip = `<div class="strip ${first ? 'first' : ''} ${hidR ? 'hidl last' : ''}" data-z="strip|${esc(rid)}"><div class="lhd"><span class="ti">${pi(hidR ? 'eyeoff' : 'bulb', 's16')}</span>${esc(head)}<em>${hidR || rid === '_all' ? L.length : esc(t('fxCnt', { n: L.length, f: L.filter(id => this._fxOn(id)).length }))}</em></div>${stripBody}</div>`;

    // tabs column
    const setb = `<div class="setb"><button data-settings><span class="si">${pi('cog', 's20')}</span><span class="at"><b>${esc(t('settings'))}</b><small>${esc(t('settingsS'))}</small></span></button></div>`;
    let body;
    if (hidR) body = `<div class="lcol"><div class="tabs"></div>${setb}</div><div class="fxp"><div class="grid"><div class="emp">${pi('eyeoff')}<span>${esc(t('hiddenRoomE'))}</span></div></div></div>`;
    else {
      const tb = x => `<div class="tb ${tid === x.id ? 'on' : ''}" data-tabsel="${esc(x.id)}" data-d="tab|${esc(x.id)}" data-label="${esc(this._tabName(x))}" data-z="tab|${esc(x.id)}">
        <span class="ti">${this._tabIcon(x)}</span><b>${esc(this._tabName(x))}</b><em>${x.fx.length}</em><button class="ed" data-edtab="${esc(x.id)}" title="${esc(t('edit'))}">${pi('pen', 's14')}</button></div>`;
      const tabs = `<div class="tabs">
        <div class="allb ${tid === '_allfx' ? 'on' : ''}" data-tabsel="_allfx"><span class="ai">${pi('grid', 's20')}</span><span class="at"><b>${esc(t('allFx'))}</b><small>${esc(t('allFxS', { n: U.size }))}</small></span></div>
        <div class="mineb ${tid === '_mine' ? 'on' : ''}" data-tabsel="_mine"><span class="ai">${pi('wand', 's20')}</span><span class="at"><b>${esc(t('mineTab'))}</b><small>${esc(t('mineTabS', { n: customList(S).length }))}</small></span></div>
        <div class="tsep"></div>
        <div class="tscroll"><div class="tb lock ${tid === '_light' ? 'on' : ''}" data-tabsel="_light"><span class="ti">${tabArt({ icon: this._lightIcon(rid) }, 'light')}</span><b>${esc(t('light'))}</b><button class="ed" data-edtab="_light" title="${esc(t('edit'))}">${pi('pen', 's14')}</button><span class="lk">${pi('lock', 's14')}</span></div>
        ${RES.tabs.map(tb).join('')}<button class="addt" data-addtab>${pi('plus', 's16')}${esc(t('addTab'))}</button></div>
        <div class="tb hidt ${tid === '_hid' ? 'on' : ''}" data-tabsel="_hid" data-z="tab|_hid"><span class="ti">${pi('eyeoff')}</span><b>${esc(t('hid'))}</b><em>${RES.hid.length}</em></div></div>`;
      const favT = RES.tabs.find(x => x.fav), favS = new Set(favT ? favT.fx : []);
      const FILL = S.fill || {}, pvK = this._pv && this._pv.room === rid ? this._pv.key : null;
      const tileH = (k, o) => {
        const u = U.get(k); if (!u) return '';
        if (FILL[k] && !(o && o.where)) o = Object.assign({}, o, { where: `<small class="where fl">${pi('sparkles')}${esc(t('fillTag'))}</small>` });
        return `<div class="fx ${this._pick.has(k) ? 'sel' : ''} ${o && o.hd ? 'hd' : ''} ${pvK === k ? 'pvon' : ''}" style="--l:${grad(fxInfo(u.rep).hues, 80, 60, '90deg')}" data-d="fx|${esc(k)}" data-label="${esc(this._label(u))}" ${o && o.n ? `data-n="${esc(o.n)}"` : ''}>
          ${favS.has(k) && !(o && o.inFav) ? `<span class="st">${pi('star')}</span>` : ''}<span class="fi">${this._ico(u, 96)}</span><span class="nm">${esc(this._label(u))}</span>${o && o.where || ''}
          <button class="fm" data-fxm="${esc(k)}" title="${esc(t('fxMenu'))}">${pi('more', 's16')}</button></div>`;
      };
      let grid;
      if (this._fill) grid = this._fillHtml();
      else if (tid === '_mine') grid = this._mineHtml();
      else if (!L.length && rid !== '_all') grid = `<div class="grid"><div class="emp">${pi('bulb')}<span>${esc(t('noLightE'))}</span><button class="addl" data-addlight>${pi('plus', 's16')}${esc(t('addLight'))}</button></div></div>`;
      else if (tid === '_light') grid = `<div class="fxh"><b>${esc(t('light'))}</b></div><div class="grid"><div class="emp">${pi('bulb')}<span>${esc(t('lightE'))}</span></div></div>`;
      else if (!U.size) grid = `<div class="grid"><div class="emp">${pi('sparkles')}<span>${esc(t('noFxRoom'))}</span></div></div>`;
      else if (tid === '_allfx') {
        const where = {}; RES.tabs.forEach(x => { if (!x.fav) x.fx.forEach(k => { where[k] = x; }); });
        const lang = this._l(), all = [...U.values()].sort((a, b) => this._label(a).localeCompare(this._label(b), lang));
        grid = `<div class="fxh"><b>${esc(t('allFx'))}</b><em>${U.size}</em><span class="grow"></span><label class="fsearch">${pi('search', 's16')}<input id="aq" placeholder="${esc(t('search'))}" value="${esc(this._q)}" autocomplete="off"></label></div>
          <div class="grid" id="allg">${all.map(u => { const w = where[u.k], n = (this._label(u) + ' ' + Object.values(u.names).join(' ')).toLocaleLowerCase(lang);
            return tileH(u.k, { hd: !w, n, where: `<small class="where ${w ? '' : 'h'}"><i>${w ? this._tabIcon(w) : pi('eyeoff')}</i>${esc(w ? this._tabName(w) : t('hid'))}</small>` }); }).join('')}</div>`;
      } else if (tid === '_hid') grid = `<div class="fxh"><b>${esc(t('hid'))}</b><em>${RES.hid.length}</em></div><div class="grid">${RES.hid.map(k => tileH(k, { hd: true })).join('') || `<div class="emp">${pi('eyeoff')}<span>${esc(t('noHidFx'))}</span></div>`}</div>`;
      else {
        const x = RES.tabs.find(q => q.id === tid);
        const hb = x.fav && x.fx.length ? `<span class="grow"></span><button class="btn sm" data-scriptfav>${pi('script', 's16')}${esc(t('scriptFav'))}</button>` : x.auto === 'mine' ? `<span class="grow"></span><button class="btn sm" data-cenew>${pi('plus', 's16')}${esc(t('mineNew'))}</button>` : '';
        grid = `<div class="fxh"><span class="hi">${this._tabIcon(x)}</span><b>${esc(this._tabName(x))}</b><em>${x.fx.length}</em>${hb}</div>
          <div class="grid" data-z="tab|${esc(x.id)}" data-ins data-src="${esc(x.id)}">${x.fx.map(k => tileH(k, { inFav: x.fav })).join('') || `<div class="emp">${pi('drag')}<span>${esc(t('dropHere'))}</span></div>`}</div>`;
      }
      body = `<div class="lcol">${tabs}${setb}</div><div class="fxp">${grid}</div>`;
    }
    const pv = this._pv, pvU = pv && pv.key ? U.get(pv.key) : null;
    const top = `<div class="top"><span class="mb"></span><span class="lg">${pi('sparkles', 's16')}</span><h1>${esc(t('title'))}</h1><span class="grow"></span>
      <button class="pvb ${pv ? 'on' : ''}" data-pv title="${esc(t('pvT'))}" aria-pressed="${pv ? 'true' : 'false'}">${pi('play', 's16')}<span class="l">${esc(t('pvB'))}</span><i class="sw2"><i></i></i></button>
      <button class="btn ic" data-undo title="${esc(t('undoK'))}" ${this._undo.length ? '' : 'disabled'}>${pi('undo', 's16')}</button>
      ${hidR ? '' : `<button class="btn ic" data-more title="${esc(t('more'))}">${pi('more', 's16')}</button>`}
      <button class="btn ic gear" data-settings title="${esc(t('settings'))}">${pi('cog', 's16')}</button></div>`;
    const pk = [...this._pick].filter(k => U.has(k));
    const selb = pk.length ? `<div class="selb"><b>${esc(t('selN', { n: pk.length }))}</b><span>${esc(t('selHint'))}</span><button class="btn ic" style="border:0;background:none" data-clr title="${esc(t('clear'))}">${pi('x', 's16')}</button></div>` : '';
    R.innerHTML = `<style>${PANEL_CSS}</style><div class="app ${this._narrow ? 'narrow' : ''} ${pv ? 'pv' : ''}">${top}
      ${pv ? `<div class="pvbar"><span class="pvd"></span><span class="tx"><b>${esc(t('pvOn'))}</b> · ${esc(t('pvWhere'))} <b>${esc(this._roomName(pv.room))}</b>${pvU ? ` · ${esc(t('pvNow', { x: this._label(pvU) }))}` : ''}</span><button class="btn sm" data-pvend="1">${pi('undo', 's16')}${esc(t('pvBack'))}</button><button class="btn sm" data-pvend="0">${esc(t('pvKeep'))}</button></div>` : ''}
      ${STORE.mode === 'local' ? `<div class="warn">${esc(t('local'))}</div>` : ''}${STORE.stale ? `<div class="warn upd"><span>${esc(t('upd', { v: STORE.stale }))}</span><button class="btn sm pri" data-reload>${esc(t('reload'))}</button></div>` : ''}
      <div class="rblock">${rooms}${strip}</div><div class="body">${body}</div>${selb}
      ${this._view === 'settings' ? this._settingsHtml() : this._view === 'reset' ? this._resetHtml() : this._view === 'restore' ? this._restoreHtml() : ''}
      <input type="file" id="icf" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" hidden><input type="file" id="bkf" accept="application/json,.json" hidden>
      <div class="toast"><span></span><button data-undo>${esc(t('undo'))}</button></div></div>`;
    if (customElements.get('ha-menu-button')) {
      this._mb = document.createElement('ha-menu-button'); this._mb.hass = this._hass; this._mb.narrow = this._narrow;
      R.querySelector('.mb').appendChild(this._mb);
    }
    [...R.querySelectorAll('.grid,.tscroll,.rooms')].forEach((el, i) => { if (keep[i]) { el.scrollTop = keep[i][0]; el.scrollLeft = keep[i][1]; } });
    if (af === 'aq') { const q = R.getElementById('aq'); if (q) { q.focus(); try { q.setSelectionRange(ss, ss); } catch (e) {} } }
    this._filterAll();
    const nd = R.querySelector('.dlg'); if (nd && dlgView === this._view) nd.scrollTop = dlgTop; this._dlgView = this._view;
    this._bind();
    if (this._tst) { const el = R.querySelector('.toast'); if (el) { el.style.transition = 'none'; this._showToast(); el.offsetWidth; el.style.transition = ''; } }
  }
  _filterAll() {
    const v = (this._q || '').toLocaleLowerCase(this._l()).trim();
    this.shadowRoot.querySelectorAll('#allg [data-n]').forEach(x => { x.style.display = !v || x.dataset.n.includes(v) ? '' : 'none'; });
  }
  _settingsHtml() {
    const t = (k, v) => this._t(k, v), S = this._set(), k = +(S.kelvin || 3200), b = +(S.brightness || 40), names = I18N[this._l()].kel, min = this._minFx(), lang = S.language || 'auto';
    // a row of choices bound to one setting; null means "default" and is not stored
    const seg = (key, cur, opts) => `<div class="segs">${opts.map(([v, n]) => `<button class="${String(cur) === String(v) ? 'on' : ''}" data-sv="${esc(key)}|${esc(v)}">${esc(n)}</button>`).join('')}</div>`;
    const sw = (key, def) => { const on = S[key] == null ? def : !!S[key]; return `<button class="swt ${on ? 'on' : ''}" data-sw="${esc(key)}|${def ? 1 : 0}" role="switch" aria-checked="${on}"></button>`; };
    const row = (title, sub, ctl) => `<div class="srow"><div class="t"><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div>${ctl}</div>`;
    const mine = customList(S);
    return `<div class="modal" data-closeset><div class="dlg">
      <div class="dh"><span class="si">${pi('cog', 's20')}</span><b>${esc(t('settings'))}</b><span class="grow"></span><button class="btn ic" data-closeset title="${esc(t('close'))}">${pi('x', 's16')}</button></div>
      <div class="sh2">${esc(t('sCard'))}</div>
      ${row(t('lang'), '', `<div class="segs">${[['auto', t('auto')], ...LANGS.map(l => [l, LANG_NAMES[l]])].map(([v, n]) => `<button class="${lang === v ? 'on' : ''}" data-lang="${v}">${esc(n)}</button>`).join('')}</div>`)}
      <div class="sh2">${esc(t('sLook'))}</div>
      ${row(t('tileSize'), '', seg('tile_size', S.tile_size || 'auto', [['auto', t('tsAuto')], ['s', t('tsS')], ['m', t('tsM')], ['l', t('tsL')]]))}
      ${row(t('icStyle'), '', seg('icon_style', S.icon_style || 'color', [['color', t('icColorS')], ['mono', t('icMonoS')]]))}
      ${row(t('bg'), t('bgThemeS'), seg('bg', S.bg || 'dark', [['dark', t('bgDark')], ['black', t('bgBlack')], ['theme', t('bgTheme')]]))}
      ${row(t('showNames'), t('showNamesS'), sw('show_names', true))}
      ${row(t('showBar'), t('showBarS'), sw('show_bar', true))}
      ${row(t('showDots'), t('showDotsS'), sw('show_dots', true))}
      <div class="sh2">${esc(t('sButtons'))}</div>
      ${row(t('showStop'), '', sw('show_stop', true))}
      ${row(t('showRandom'), t('showRandomS'), sw('show_random', true))}
      <div class="sh2">${esc(t('sBehave'))}</div>
      ${row(t('fxOn'), t('fxOnS'), seg('fx_on_brightness', S.fx_on_brightness || 0, [[0, t('fxOnOff')], [30, '%30'], [50, '%50'], [80, '%80'], [100, '%100']]))}
      ${row(t('startTab'), '', seg('start_tab', S.start_tab || 'auto', [['auto', t('stAuto')], ['fav', t('stFav')], ['last', t('stLast')], ['light', t('stLight')]]))}
      ${row(t('lp'), t('lpS'), seg('long_press', S.long_press || 550, [[300, '0,3 sn'], [450, '0,45 sn'], [550, '0,55 sn'], [800, '0,8 sn']]))}
      ${row(t('haptic'), t('hapticS'), sw('haptics', true))}
      ${row(t('fade'), t('fadeS'), seg('transition', S.transition || 0, [[0, t('fadeNo')], ['0.5', '0,5 ' + t('sec')], [1, '1 ' + t('sec')], [2, '2 ' + t('sec')], [5, '5 ' + t('sec')]]))}
      ${row(t('showRecent'), t('showRecentS'), sw('show_recent', true))}
      <div class="sh2">${esc(t('sStop'))}</div>
      ${row(t('white'), k + 'K', `<div class="kel">${KELV.map(([kv, c], i) => `<button class="${kv === k ? 'on' : ''}" data-k="${kv}" style="background:${c}">${esc(names[i])}</button>`).join('')}</div>`)}
      <div class="srow"><div class="t"><b>${esc(t('bright'))}</b><small id="bv">%${b}</small></div><input class="rng" id="gb" type="range" min="1" max="100" value="${b}"></div>
      <div class="sh2">${esc(t('sNight'))}</div>
      ${row(t('night'), t('nightS'), sw('night_on', false))}
      ${S.night_on ? `<div class="srow"><div class="t"><b>${esc(t('from'))} · ${esc(t('to'))}</b></div><input class="tin" type="time" id="nf" value="${esc(S.night_from || '23:00')}"><input class="tin" type="time" id="nt" value="${esc(S.night_to || '07:00')}"></div>
      ${row(t('nightMax'), '', seg('night_max', S.night_max || 30, [[10, '%10'], [20, '%20'], [30, '%30'], [50, '%50'], [70, '%70']]))}` : ''}
      <div class="sh2">${esc(t('sRooms'))}</div>
      ${row(t('groups'), t('groupsS'), sw('include_groups', false))}
      <div class="srow"><div class="t"><b>${esc(t('thr'))}</b><small>${esc(t('thrS'))}</small></div><div class="segs">${[1, 2, 3, 5, 10].map(n => `<button class="${min === n ? 'on' : ''}" data-min="${n}">${esc(t('thrN', { n }))}</button>`).join('')}</div></div>
      <div class="sh2">${esc(t('sBackup'))}</div>
      ${row(t('bkDown'), t('bkDownS'), `<button class="btn" data-bkdown>${pi('download', 's16')}${esc(t('bkDown'))}</button>`)}
      ${row(t('bkUp'), t('bkUpS'), `<button class="btn" data-bkup>${pi('upload', 's16')}${esc(t('bkUp'))}</button>`)}
      <div class="sh2">${esc(t('sReset'))}</div>
      ${row(t('resetAll'), t('resetAllS'), `<button class="btn danger" data-resetask>${pi('trash', 's16')}${esc(t('resetAll'))}</button>`)}
    </div></div>`;
  }
  _restoreHtml() {
    const t = (k, v) => esc(this._t(k, v)), b = this._bk || {}; let d = ''; try { d = new Date(b.date).toLocaleString(this._l()); } catch (e) {}
    return `<div class="modal" data-closerestore><div class="dlg sm">
      <div class="dh"><span class="si">${pi('upload', 's20')}</span><b>${t('bkQ')}</b></div>
      <p class="rw">${t('bkW', { d: d || '?' })}</p>
      <div class="dbtns"><button class="btn" data-closerestore>${t('cancel')}</button><button class="btn pri" data-bkyes>${t('bkYes')}</button></div>
    </div></div>`;
  }
  async _backupDown() {
    const d = STORE.d, icons = {}, t = (k, v) => this._t(k, v); this._toast(t('bkBusy'), false);
    for (const [k, url] of Object.entries(d.icons || {})) {
      try { const b = await (await fetch(url)).blob(); icons[k] = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(b); }); } catch (e) {}
    }
    const out = { format: 'lemur-light-effects-backup', version: CARD_VERSION, date: new Date().toISOString(), data: { settings: d.settings || {}, tabs: d.tabs || {}, favorites: d.favorites || [], hidden: d.hidden || [], rooms: d.rooms || {} }, icons };
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' }));
    a.download = 'lemur-backup-' + new Date().toISOString().slice(0, 10) + '.json'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    this._toast(t('bkSaved'), false);
  }
  async _backupApply() {
    const b = this._bk, t = k => this._t(k); if (!b) return;
    this._snap();
    const D = b.data || {};
    STORE.set('settings', D.settings && typeof D.settings === 'object' ? D.settings : {});
    STORE.set('tabs', D.tabs && typeof D.tabs === 'object' ? D.tabs : {});
    STORE.set('favorites', Array.isArray(D.favorites) ? D.favorites : []); STORE.set('hidden', Array.isArray(D.hidden) ? D.hidden : []);
    STORE.set('rooms', D.rooms && typeof D.rooms === 'object' ? D.rooms : {});
    const keep = b.icons || {};
    for (const k of Object.keys(STORE.d.icons || {})) if (!keep[k]) await STORE.iconDel(k);
    for (const [k, url] of Object.entries(keep)) { const m = String(url).match(/^data:(image\/(png|jpeg|webp|gif));base64,(.+)$/); if (m) try { await STORE.icon(k, m[1], m[3]); } catch (e) {} }
    this._bk = null; this._view = 'edit'; this._ce = null; this._tab = {}; this._render(); this._toast(t('bkOk'), false);
  }
  _resetHtml() {
    const t = k => esc(this._t(k));
    return `<div class="modal" data-closereset><div class="dlg sm">
      <div class="dh"><span class="si warnc">${pi('trash', 's20')}</span><b>${t('resetQ')}</b></div>
      <p class="rw">${t('resetW')}</p>
      <div class="dbtns"><button class="btn" data-closereset>${t('cancel')}</button><button class="btn danger" data-resetyes>${t('resetYes')}</button></div>
    </div></div>`;
  }
  // every effect any light at home has: key → representative name (for the base effect list)
  _allFx() {
    const H = this._hass, A = new Map();
    for (const id of lightPool(H, false)) { const l = H.states[id].attributes.effect_list; if (!Array.isArray(l)) continue; for (const [k, n] of parseList(l).m) if (!A.has(k) || (GOVL.has(n) && !GOVL.has(A.get(k)))) A.set(k, n); }
    return A;
  }
  _actTxt(a) {
    const t = k => this._t(k);
    if (typeof a === 'string') return a;
    if (!a) return '';
    if (a.mode === 'fx') return a.fx;
    if (a.mode === 'color') return t('m_color') + (a.br ? ' · %' + a.br : '');
    if (a.mode === 'white') return (a.k || 3000) + 'K' + (a.br ? ' · %' + a.br : '');
    return t('m_' + a.mode);
  }
  // "Create effect": the list of own effects, or the editor of one (this._ce is the working copy)
  _mineHtml() {
    const t = (k, v) => this._t(k, v), S = this._set(), c = this._ce, H = this._hass, M = this._M, lang = this._l();
    if (!c) {
      const L = customList(S);
      return `<div class="fxh"><span class="hi">${pi('wand', 's20')}</span><b>${esc(t('mineList'))}</b><em>${L.length}</em>${L.length ? `<small class="mut" style="margin-left:6px">${esc(t('mineDrag'))}</small>` : ''}<span class="grow"></span><button class="btn sm pri" data-cenew>${pi('plus', 's16')}${esc(t('mineNew'))}</button></div>
        <div class="grid">${L.map(x => { const u = { k: 'u:' + x.id, rep: x.base_name || x.name, label: x.name, custom: x }, n = x.v === 2 ? Object.keys(x.lights || {}).length : null;
          return `<div class="fx mfx" data-ceedit="${esc(x.id)}" data-d="fx|${esc(u.k)}" data-label="${esc(x.name)}" style="--l:${grad(fxInfo(u.rep).hues, 80, 60, '90deg')}"><span class="fi">${this._ico(u, 96)}</span><span class="nm">${esc(x.name)}</span>${n != null ? `<small class="where">${esc(t('nLin', { n }))}</small>` : ''}</div>`; }).join('') || `<div class="emp">${pi('wand')}<span>${esc(t('mineEmpty'))}</span><button class="btn pri" data-cenew>${pi('plus', 's16')}${esc(t('mineNew'))}</button></div>`}</div>`;
    }
    const A = this._allFx(), base = [...A].map(([k, rep]) => [k, this._label({ rep })]).sort((a, b) => a[1].localeCompare(b[1], lang));
    const fxOf = id => { const l = H.states[id] && H.states[id].attributes.effect_list; return Array.isArray(l) ? [...parseList(l).m.values()].sort((a, b) => a.localeCompare(b, lang)) : []; };
    const act = (who, a, light) => {
      const m = (a && a.mode) || (who === '_fb' ? 'color' : 'auto'), hasFx = light && fxOf(light).length;
      const modes = [...(who === '_fb' ? [] : ['auto']), ...(hasFx ? ['fx'] : []), 'color', 'white', 'off', ...(who === '_fb' ? ['skip'] : [])];
      let h = `<select data-cm="${esc(who)}">${modes.map(x => `<option value="${x}" ${x === m ? 'selected' : ''}>${esc(t('m_' + x))}</option>`).join('')}</select>`;
      if (m === 'fx' && hasFx) h += `<select data-cfx="${esc(who)}">${fxOf(light).map(n => `<option ${a.fx === n ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>`;
      if (m === 'color') h += `<input type="color" data-crgb="${esc(who)}" value="${rgbHex(a.rgb)}">`;
      if (m === 'white') h += `<select data-ck="${esc(who)}">${KELV.map(([k]) => `<option value="${k}" ${+(a.k || 2700) === k ? 'selected' : ''}>${k}K</option>`).join('')}</select>`;
      if (m === 'color' || m === 'white') h += `<label class="cbr" title="${esc(t('bri'))}">☀<input type="number" min="1" max="100" data-cbr="${esc(who)}" value="${esc(a.br || '')}">%</label>`;
      return `<div class="act">${h}</div>`;
    };
    const roomOf = id => this._roomOf(M, id);
    const inIds = Object.keys(c.lights || {}).filter(id => H.states[id]);
    const rooms = M.order.filter(r => r !== '_all' && (M.by[r] || []).length);
    const chip = id => `<div class="clt" data-d="cl|${esc(id)}" data-label="${esc(this._name(id))}">${this._lightDot(id)}<span class="tx"><b>${esc(this._name(id))}</b><small>${esc(this._fxOn(id) ? t('fxN', { n: this._fxCount(id) }) : t('lOnly'))}</small></span><button class="btn ic sm" data-ceadd="${esc(id)}" title="${esc(t('addLight'))}">${pi('plus', 's16')}</button></div>`;
    const pool = rooms.map(r => { const L = M.by[r].filter(id => !inIds.includes(id)); return L.length ? `<div class="crm">${esc(this._roomName(r))}<span class="grow"></span><button class="lnk" data-ceaddr="${esc(r)}">${esc(t('addAllR'))}</button></div>${L.map(chip).join('')}` : ''; }).join('') || `<div class="emp sm">${esc(t('allIn'))}</div>`;
    const row = id => {
      const l = H.states[id].attributes.effect_list, has = !!(c.base && Array.isArray(l) && parseList(l).m.has(c.base) && this._fxOn(id));
      const ex = c.lights[id] || { mode: 'auto' }, eff = customAction(c, H, id, this._fxOn(id));
      const note = ex.mode === 'auto' ? t('autoIs', { x: eff ? this._actTxt(eff) : t('m_skip') }) : '';
      return `<div class="clr" data-d="cl|${esc(id)}" data-label="${esc(this._name(id))}">${this._lightDot(id)}<span class="tx"><b>${esc(this._name(id))}</b><small>${esc(this._roomName(roomOf(id) || '_none'))}${c.base ? ' · ' + esc(has ? t('supBase') : t('noBase')) : ''}${note ? ' · ' + esc(note) : ''}</small></span>${act(id, ex, id)}<button class="btn ic sm" data-cerem="${esc(id)}" title="${esc(t('remL'))}">${pi('x', 's14')}</button></div>`;
    };
    const cur = { k: 'u:' + c.id, rep: c.base_name || c.name || 'x', label: c.name, custom: c };
    const saved = customList(S).some(x => x.id === c.id);
    return `<div class="ceh">
        <button class="btn ic" data-closece title="${esc(t('back'))}">${pi('undo', 's16')}</button>
        <button class="cei" data-ceicons title="${esc(t('ceIcon'))}">${this._ico(cur, 46)}</button>
        <input class="tin" id="cename" value="${esc(c.name || '')}" placeholder="${esc(t('ceName'))}" autocomplete="off">
        <label class="cel"><small>${esc(t('ceBase'))}</small><select id="cebase"><option value="">${esc(t('ceNoBase'))}</option>${base.map(([k, n]) => `<option value="${esc(k)}" ${c.base === k ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></label>
        <span class="grow"></span>
        ${saved ? `<button class="btn danger sm" data-cedel>${pi('trash', 's16')}${esc(t('del'))}</button>` : ''}
        <button class="btn pri" data-cesave>${esc(t('save'))}</button>
      </div>
      ${c.base ? `<div class="cefb"><small>${esc(t('fbDef'))}</small>${act('_fb', c.fallback || { mode: 'color', rgb: [255, 140, 60], br: 60 }, null)}</div>` : ''}
      <div class="cecols">
        <div class="cepool" data-z="cz|out"><div class="ceht"><b>${esc(t('allL'))}</b><small>${esc(t('allLS'))}</small></div>${pool}</div>
        <div class="cezone" data-z="cz|in"><div class="ceht"><b>${esc(t('inFx'))}</b><em>${inIds.length}</em><small>${esc(t('inFxS'))}</small></div>${inIds.map(row).join('') || `<div class="emp">${pi('drag')}<span>${esc(t('dropL'))}</span></div>`}</div>
      </div>`;
  }
  // ---- fill in an effect: what lights without it do (settings.fill[key]) ----
  _fillOpen(k, room) {
    const M = this._model(); this._M = M;
    const has = r => this._effects(this._lightsOf(M, r)).has(k);
    if (room && M.order.includes(room) && has(room)) this._room = room;
    if (!this._room || !has(this._room)) { const r = M.order.find(x => x !== '_all' && has(x)) || (has('_all') ? '_all' : null); if (r) this._room = r; }
    const cur = (this._set().fill || {})[k];
    const hue = (fxInfo((this._allFx().get(k)) || k).hues || [30])[0], rgb = hsl2rgb(hue, 85, 58);
    this._fill = { k, cfg: cur ? clone(cur) : { all: { mode: 'color', rgb, br: 60 }, lights: {} } };
    this._ce = null; this._view = 'edit'; this._closePop(); this._render();
  }
  _fillHtml() {
    const t = (x, v) => this._t(x, v), F = this._fill, k = F.k, c = F.cfg, H = this._hass, M = this._M, A = this._allFx(), rep = A.get(k) || k;
    const u = { k, rep, names: {} }, lname = this._label(u), saved = !!(this._set().fill || {})[k];
    const rooms = M.order.filter(r => r !== '_all' && (M.by[r] || []).length);
    const hasIt = id => { const l = H.states[id] && H.states[id].attributes.effect_list; return Array.isArray(l) && parseList(l).m.has(k); };
    const sup = [], miss = [];
    rooms.forEach(r => M.by[r].forEach(id => { (hasIt(id) && this._fxOn(id) ? sup : miss).push([r, id]); }));
    const fxOf = id => { const l = H.states[id] && H.states[id].attributes.effect_list; return Array.isArray(l) ? [...parseList(l).m.values()].sort((a, b) => a.localeCompare(b, this._l())) : []; };
    const act = (who, a, light) => {
      const all = who === '_all', m = (a && a.mode) || (all ? 'skip' : 'auto'), hasFx = light && fxOf(light).length;
      const modes = [...(all ? [] : ['auto']), ...(hasFx ? ['fx'] : []), 'color', 'white', 'off', 'skip'];
      let h = `<select data-fm="${esc(who)}">${modes.map(x => `<option value="${x}" ${x === m ? 'selected' : ''}>${esc(x === 'auto' ? t('m_def') : t('m_' + x))}</option>`).join('')}</select>`;
      if (m === 'fx' && hasFx) h += `<select data-ffx="${esc(who)}">${fxOf(light).map(n => `<option ${a.fx === n ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>`;
      if (m === 'color') h += `<input type="color" data-frgb="${esc(who)}" value="${rgbHex(a.rgb)}">`;
      if (m === 'white') h += `<select data-fk="${esc(who)}">${KELV.map(([kk]) => `<option value="${kk}" ${+(a.k || 2700) === kk ? 'selected' : ''}>${kk}K</option>`).join('')}</select>`;
      if (m === 'color' || m === 'white') h += `<label class="cbr" title="${esc(t('bri'))}">☀<input type="number" min="1" max="100" data-fbr="${esc(who)}" value="${esc(a.br || '')}">%</label>`;
      return `<div class="act">${h}</div>`;
    };
    const row = ([r, id]) => { const a = (c.lights || {})[id] || { mode: 'auto' }; return `<div class="clr">${this._lightDot(id)}<span class="tx"><b>${esc(this._name(id))}</b><small>${esc(this._roomName(r))}${hasIt(id) ? ' · ' + esc(t('fillNoEff')) : this._fxOn(id) ? '' : ' · ' + esc(t('lOnly'))}</small></span>${act(id, a, id)}</div>`; };
    const byRoom = {}; miss.forEach(x => (byRoom[x[0]] = byRoom[x[0]] || []).push(x));
    return `<div class="ceh">
        <button class="btn ic" data-fillclose title="${esc(t('back'))}">${pi('undo', 's16')}</button>
        <span class="cei">${this._ico(u, 46)}</span>
        <div class="fh"><b>${esc(t('fillHead', { x: lname }))}</b><small>${esc(t('fillS'))}</small></div>
        <span class="grow"></span>
        ${saved ? `<button class="btn danger sm" data-filldel>${pi('trash', 's16')}${esc(t('fillDel'))}</button>` : ''}
        <button class="btn pri" data-fillsave ${miss.length ? '' : 'disabled'}>${esc(t('save'))}</button>
      </div>
      <div class="fsup"><small>${esc(t('fillSup'))}</small>${sup.map(([r, id]) => `<span class="fchip">${this._lightDot(id)}${esc(this._name(id))}</span>`).join('') || '–'}</div>
      ${miss.length ? `<div class="cefb fall"><span class="tx"><b>${esc(t('fillAll'))}</b><small>${esc(t('fillAllS'))}</small></span>${act('_all', c.all || { mode: 'skip' }, null)}</div>
      <div class="fmiss"><div class="ceht"><b>${esc(t('fillMiss'))}</b><em>${miss.length}</em></div>${Object.keys(byRoom).map(r => `<div class="crm">${esc(this._roomName(r))}</div>${byRoom[r].map(row).join('')}`).join('')}</div>`
        : `<div class="grid"><div class="emp">${pi('sparkles')}<span>${esc(t('fillNone'))}</span></div></div>`}`;
  }
  _fillSlot(who) { const c = this._fill.cfg; if (who === '_all') return c.all || (c.all = { mode: 'skip' }); c.lights = c.lights || {}; return c.lights[who] || (c.lights[who] = { mode: 'auto' }); }
  _fillSave() {
    const F = this._fill, c = clone(F.cfg), L = {};
    Object.entries(c.lights || {}).forEach(([id, a]) => { if (a && a.mode && a.mode !== 'auto') L[id] = a; });
    const out = { all: c.all && c.all.mode !== 'skip' ? c.all : null, lights: L };
    const FL = Object.assign({}, this._set().fill || {}), nm = this._label({ rep: this._allFx().get(F.k) || F.k });
    if (!out.all && !Object.keys(L).length) delete FL[F.k]; else FL[F.k] = out;
    this._fill = null; this._snap(); this._save({ fill: Object.keys(FL).length ? FL : null }, this._t('fillSaved', { x: nm }));
  }
  _fillDelete() {
    const F = this._fill, FL = Object.assign({}, this._set().fill || {}), nm = this._label({ rep: this._allFx().get(F.k) || F.k }); delete FL[F.k];
    this._fill = null; this._snap(); this._save({ fill: Object.keys(FL).length ? FL : null }, this._t('fillDeleted', { x: nm }));
  }
  _ceMove(ids, into) {
    const c = this._ce; if (!c) return this._render(); c.lights = c.lights || {};
    ids.forEach(id => { if (into) { if (!c.lights[id]) c.lights[id] = { mode: 'auto' }; } else delete c.lights[id]; });
    this._render();
  }
  _ceIconPop(el) {
    const t = (k, v) => this._t(k, v), lang = this._l(), c = this._ce;
    const p = this._popAt(el, `<div style="padding:0 4px"><input id="ceiq" placeholder="${esc(t('searchI'))}" autocomplete="off"></div><div class="igrid ig3" id="ceig">${Object.keys(ICON3).map(k => [k, icName(k, lang)]).sort((a, b) => a[1].localeCompare(b[1], lang)).map(([k, n]) => `<button class="${c.icon === 'c:' + k ? 'on' : ''}" data-ceic="${esc(k)}" data-n="${esc((n + ' ' + k).toLocaleLowerCase(lang))}" title="${esc(n)}">${ICON3[k]}</button>`).join('')}</div>`, { w: 470 });
    const q = p.querySelector('#ceiq'); if (q) q.focus();
  }
  _ceDefault(mode, light) {
    if (mode === 'color') return { mode, rgb: [255, 140, 60], br: 60 };
    if (mode === 'white') return { mode, k: 2700, br: 50 };
    if (mode === 'fx') { const l = this._hass.states[light] && this._hass.states[light].attributes.effect_list; const n = Array.isArray(l) ? [...parseList(l).m.values()].sort()[0] : ''; return { mode, fx: n }; }
    return { mode };
  }
  _ceSlot(who) { const c = this._ce; if (who === '_fb') return c.fallback || (c.fallback = { mode: 'color', rgb: [255, 140, 60], br: 60 }); c.lights = c.lights || {}; return c.lights[who] || (c.lights[who] = { mode: 'auto' }); }
  _ceOpen(id) {
    const S = this._set(), ex = customList(S).find(x => x.id === id);
    this._ce = ex ? clone(ex) : { id: newId(), v: 2, name: '', icon: '', base: '', base_name: '', fallback: { mode: 'color', rgb: [255, 140, 60], br: 60 }, lights: {} };
    // older own effects (every light took part) become "only these lights", with the lights that took part
    if (this._ce.v !== 2) { const H = this._hass, c = this._ce, L = {}; lightPool(H, false).forEach(id => { const a = customAction(c, H, id, this._fxOn(id)); if (a) L[id] = c.lights && c.lights[id] ? c.lights[id] : { mode: 'auto' }; }); c.lights = L; c.v = 2; }
    this._view = 'edit'; this._tab[this._room] = '_mine'; this._closePop(); this._render();
  }
  _ceSave() {
    const c = this._ce, t = (k, v) => this._t(k, v), nm = (c.name || '').trim();
    if (!nm) { this._toast(t('ceNameErr'), false); const i = this.shadowRoot.getElementById('cename'); if (i) i.focus(); return; }
    c.name = nm;
    c.v = 2; c.lights = c.lights || {};
    const L = customList(this._set()).filter(x => x.id !== c.id); L.push(c);
    this._ce = null; this._save({ custom: L }, t('ceSaved', { x: nm }));
  }
  _ceDelete(id) {
    const S = this._set(), c = customList(S).find(x => x.id === id); if (!c) return;
    this._ce = null; this._save({ custom: customList(S).filter(x => x.id !== id) }, this._t('mineDel', { x: c.name }));
  }
  async _scripts(rid, keys) {
    const H = this._hass, t = (k, v) => this._t(k, v), U = this._effects(this._lightsOf(this._M, rid)); let n = 0;
    try {
      for (const k of keys) {
        const u = U.get(k); if (!u) continue;
        const id = ('lemur_' + slug(this._roomName(rid)) + '_' + slug(this._label(u))).slice(0, 64);
        await H.callApi('POST', 'config/script/config/' + id, { alias: this._roomName(rid) + ' · ' + this._label(u), icon: 'mdi:lightbulb-auto', mode: 'single', sequence: scriptSteps(u) });
        n++;
      }
      this._toast(t('scriptOk', { n }), false);
    } catch (e) { this._toast(t('scriptErr', { e: (e && (e.body && e.body.message || e.message)) || e }), false); }
  }
  _resetAll() {
    const keys = Object.keys(STORE.d.icons || {});
    STORE.set('settings', {}); STORE.set('tabs', {}); STORE.set('favorites', []); STORE.set('hidden', []); STORE.set('rooms', {});
    keys.forEach(k => STORE.iconDel(k));
    this._undo = []; this._view = 'edit'; this._tab = {}; this._pick.clear(); this._toast(this._t('resetOk'), false);
  }
  _roomIconPop(el) {
    const t = (k, v) => this._t(k, v), rid = this._room, cur = (this._set().room_icons || {})[rid] || '';
    const p = this._popAt(el, `<div class="pt">${esc(t('roomIconT', { r: this._roomName(rid) }))}</div>
      <button class="it ${cur ? '' : 'on'}" data-ricon="">${pi('reset', 's16')}${esc(t('defIcon'))}</button>
      <div class="igrid ri">${ROOM_ICONS.map(ic => `<button class="${cur === ic ? 'on' : ''}" data-ricon="${esc(ic)}" title="${esc(ic)}">${this._hi(ic, pi('home', 's16'))}</button>`).join('')}</div>
      <div class="rii"><input id="riq" placeholder="${esc(t('mdiPh'))}" value="${esc(cur)}" autocomplete="off"><button class="btn sm" data-riapply>${esc(t('apply'))}</button></div>`, { right: true, w: 340 });
    return p;
  }
  _setRoomIcon(ic) {
    const RI = Object.assign({}, this._set().room_icons || {}), rid = this._room;
    if (ic) RI[rid] = ic; else delete RI[rid];
    this._closePop(); this._save({ room_icons: Object.keys(RI).length ? RI : null });
  }

  // ---- popovers ----
  _closePop() {
    const had = this.shadowRoot.querySelectorAll('.pop'); had.forEach(p => { if (p.parentNode) try { p.parentNode.removeChild(p); } catch (e) {} });
    if (had.length && this._pend) Promise.resolve().then(() => { if (this._pend && !this.shadowRoot.querySelector('.pop')) { this._pend = false; this._render(); } });
  }
  _popAt(el, html, o = {}) {
    this._closePop();
    const R = this.shadowRoot, r = el.getBoundingClientRect(), p = document.createElement('div'); p.className = 'pop'; p.innerHTML = html;
    R.querySelector('.app').appendChild(p);
    if (o.w) { p.style.width = o.w + 'px'; p.style.maxWidth = 'calc(100vw - 24px)'; }
    const w = p.offsetWidth, room = innerHeight - r.bottom - 18, above = r.top - 18;
    let left = o.right ? r.right - w : r.left; left = Math.max(12, Math.min(left, innerWidth - w - 12)); p.style.left = left + 'px';
    if (o.up || (p.offsetHeight > room && above > room)) { p.style.bottom = (innerHeight - r.top + 6) + 'px'; p.style.maxHeight = above + 'px'; }
    else { p.style.top = (r.bottom + 6) + 'px'; p.style.maxHeight = room + 'px'; }
    return p;
  }
  _addTabPop(el) {
    const t = (k, v) => this._t(k, v), U = this._U, RES = this._RES, M = this._M, have = new Set(RES.tabs.map(x => this._tabName(x)));
    const row = (key, name, icon, n, from) => `<button class="it ${n ? '' : 'dis'}" data-addt="${esc(key)}"><span class="ti">${icon}</span>${esc(name)}<small>${from ? esc(from) + ' · ' : ''}${esc(t('nFx', { n }))}</small></button>`;
    let h = `<button class="it" data-addt="_empty"><span class="ti">${pi('plus', 's16')}</span>${esc(t('emptyTab'))}</button>`, hz = '', o = '';
    const grp = this._grp(U);
    for (const g of GROUPS) { const nm = GNAME[this._l()][g]; if (!have.has(nm)) hz += row('g:' + g, nm, tabArt({ auto: g }), [...U.keys()].filter(k => grp(k) === g).length); }
    if (hz) h += `<div class="t">${esc(t('ready'))}</div>` + hz;
    for (const r of M.order) {
      if (r === this._room) continue;
      const U2 = this._effects(this._lightsOf(M, r)), R2 = this._resolve(r, U2);
      R2.tabs.forEach(x => { if (!x.fav && !x.auto && x.fx.length) o += row('r:' + r + ':' + x.id, this._tabName(x), this._tabIcon(x), x.fx.filter(k => U.has(k)).length, this._roomName(r)); });
    }
    if (o) h += `<div class="t">${esc(t('fromRooms'))}</div>` + o;
    this._popAt(el, h);
  }
  _editTabPop(el, id) {
    const t = (k, v) => this._t(k, v), lt = id === '_light', x = lt ? { id, icon: this._lightIcon(), lock: 1 } : this._RES.tabs.find(q => q.id === id); if (!x) return;
    const fixed = x.fav || lt, lang = this._l(), def = !x.icon || x.icon === 'sparkle' || (!lt && x.icon === GICON[x.fav ? 'fav' : x.auto]), cur = def ? '' : x.icon, low = s => String(s).toLocaleLowerCase(lang);
    const btn = (v, ic, n, f) => `<button class="${cur === v ? 'on' : ''}" data-ticon="${esc(id)}|${esc(v)}" data-n="${esc(low(n + ' ' + f))}" title="${esc(n)}">${ic}</button>`;
    const col = Object.keys(ICON3).map(k => [k, icName(k, lang)]).sort((a, b) => a[1].localeCompare(b[1], lang)).map(([k, n]) => btn('c:' + k, ICON3[k], n, k.replace(/_/g, ' '))).join('');
    const mono = Object.keys(ICONS).filter(n => n !== 'generic').map(n => btn(n, svg(n), n, '')).join('');
    const dflt = `<button class="it ${cur ? '' : 'on'}" data-ticon="${esc(id)}|"><span class="ti">${tabArt(lt ? {} : { fav: x.fav, auto: x.auto }, lt ? 'light' : null)}</span>${esc(t('defIcon'))}</button>`;
    const p = this._popAt(el, `<div style="padding:4px 4px 0"><input data-tname="${esc(id)}" value="${esc(lt ? t('light') : this._tabName(x))}" ${fixed ? 'disabled' : ''}></div>
      <div style="padding:0 4px"><input id="iq" placeholder="${esc(t('searchI'))}" autocomplete="off"></div>
      ${dflt}
      <div class="t">${esc(t('icColor'))}</div><div class="igrid ig3">${col}</div>
      <div class="t">${esc(t('icMono'))}</div><div class="igrid">${mono}</div>
      ${fixed ? '' : `<hr><button class="it del" data-tdel="${esc(id)}">${pi('trash', 's16')}${esc(t('delTab'))}</button>`}`, { w: 470 });
    const i = p.querySelector('input'); if (i && !fixed) { i.focus(); i.select(); }
    const q = p.querySelector('#iq'); if (!q) return;
    q.oninput = () => {
      const v = low(q.value).trim();
      p.querySelectorAll('.igrid').forEach(g => {
        let any = false;
        g.querySelectorAll('button').forEach(b => { const ok = !v || b.dataset.n.includes(v); b.style.display = ok ? '' : 'none'; if (ok) any = true; });
        g.style.display = any ? '' : 'none'; if (g.previousElementSibling) g.previousElementSibling.style.display = any ? '' : 'none';
      });
    };
  }
  _addLightPop(el) {
    const t = (k, v) => this._t(k, v), M = this._M, cur = this._lightsOf(M, this._room), by = {}, lang = this._l();
    [...M.order.filter(a => a !== '_all'), '_hidden'].forEach(r => { this._lightsOf(M, r).forEach(id => { if (!cur.includes(id)) (by[r] = by[r] || []).push(id); }); });
    const p = this._popAt(el, `<div class="pt">${esc(t('addLightT', { r: this._roomName(this._room) }))}</div><div style="padding:0 4px"><input id="lq" placeholder="${esc(t('searchL'))}" autocomplete="off"></div>
      <div id="lql">${Object.keys(by).map(r => `<div class="t">${esc(this._roomName(r))}</div>${by[r].map(id => { const n = this._fxCount(id); return `<button class="it" data-takel="${esc(id)}" data-n="${esc((this._name(id) + ' ' + id).toLocaleLowerCase(lang))}">${this._lightDot(id)}${esc(this._name(id))}<small>${esc(this._fxOn(id) ? t('fxN', { n }) : t('lOnly'))}</small></button>`; }).join('')}`).join('')}</div>`, { w: 360 });
    const q = p.querySelector('#lq'); q.focus();
    q.oninput = () => {
      const v = q.value.toLocaleLowerCase(lang);
      p.querySelectorAll('[data-takel]').forEach(b => { b.style.display = b.dataset.n.includes(v) ? '' : 'none'; });
      p.querySelectorAll('#lql .t').forEach(h => { let n = h.nextElementSibling, any = false; while (n && !n.classList.contains('t')) { if (n.style.display !== 'none') any = true; n = n.nextElementSibling; } h.style.display = any ? '' : 'none'; });
    };
  }
  // where a light goes when it is taken out of the room it is shown in
  _outTarget(id) {
    const M = this._M, cur = this._roomOf(M, id), home = this._homeOf(id);
    if (cur === '_hidden' || (home !== cur && !(home === '_none' && cur === '_none'))) return home;
    return '_hidden';
  }
  _lightOut(id) { return this._moveLights([id], this._outTarget(id)); }
  _lightPop(el, id) {
    const t = (k, v) => this._t(k, v), M = this._M, cur = this._roomOf(M, id), home = this._homeOf(id), out = this._outTarget(id), n = this._fxCount(id);
    const rooms = [...M.order.filter(r => r !== '_all' && r !== cur && r !== out), ...M.empty.map(a => a.area_id).filter(r => r !== cur && r !== out)];
    const on = this._fxOn(id);
    this._popAt(el, `<div class="fxd">${this._lightDot(id)}<div><b>${esc(this._name(id))}</b><small>${esc(id)} · ${esc(n ? t('fxN', { n }) : t('noFxL'))}</small></div></div>
      ${cur === '_hidden' ? '' : n ? `<button class="it fxu" data-lfx="${esc(id)}">${pi('sparkles', 's16')}<span class="fxt"><b>${esc(t('fxUse'))}</b><small>${esc(t('fxUseS'))}</small></span><span class="swt ${on ? 'on' : ''}"></span></button><hr>` : `<div class="it dis">${pi('bulb', 's16')}${esc(t('fxNone'))}</div><hr>`}
      ${out === '_hidden' ? `<button class="it del" data-lout="${esc(id)}">${pi('eyeoff', 's16')}${esc(t('lHide'))}</button>` : `<button class="it" data-lout="${esc(id)}">${pi('undo', 's16')}${esc(t('lBack', { r: this._roomName(home) }))}</button>`}
      ${cur !== '_hidden' && out !== '_hidden' ? `<button class="it del" data-lto="${esc(id)}|_hidden">${pi('eyeoff', 's16')}${esc(t('lHide'))}</button>` : ''}
      ${rooms.length ? `<hr><div class="t">${esc(t('lMove'))}</div>${rooms.map(r => `<button class="it" data-lto="${esc(id)}|${esc(r)}">${pi('home', 's16')}${esc(this._roomName(r))}</button>`).join('')}` : ''}`, { w: 320 });
  }
  _addRoomPop(el) {
    const t = (k, v) => this._t(k, v), E = this._M.empty;
    this._popAt(el, `<div class="t">${esc(t('addRoomT'))}</div>${E.map(a => `<button class="it" data-pickroom="${esc(a.area_id)}"><span class="ti">${this._hi(a.icon, pi('home', 's16'))}</span>${esc(a.name)}</button>`).join('') || `<div class="it dis">${esc(t('addRoomNone'))}</div>`}`);
  }
  _morePop(el) {
    const t = (k, v) => this._t(k, v), rid = this._room, M = this._M, others = M.order.filter(r => r !== rid && r !== '_all'), S = this._set();
    const off = rid === '_all' ? !allHomeOn(S) : (S.hidden_areas || []).includes(rid);
    this._popAt(el, `<button class="it" data-riconpop>${this._hi((S.room_icons || {})[rid] || ((this._hass.areas || {})[rid] || {}).icon || 'mdi:home', pi('home', 's16'))}${esc(t('roomIcon'))}</button>
      <button class="it" data-reset>${pi('reset', 's16')}${esc(t('reset', { r: this._roomName(rid) }))}</button>
      <button class="it" data-roff>${pi(off ? 'eye' : 'eyeoff', 's16')}${esc(rid === '_all' ? (off ? t('allOnB') : t('allOffB')) : off ? t('roomOn') : t('roomOff'))}</button>
      ${others.length ? `<hr><div class="t">${esc(t('copyT', { r: this._roomName(rid) }))}</div>${others.map(r => `<button class="it" data-copyto="${esc(r)}">${pi('copy', 's16')}${esc(this._roomName(r))}</button>`).join('')}<button class="it" data-copyto="*">${pi('copy', 's16')}${esc(t('copyAll'))}</button>` : ''}`, { right: true });
  }
  _fxPop(el, k) {
    const t = (x, v) => this._t(x, v), u = this._U.get(k); if (!u) return;
    const favT = this._RES.tabs.find(x => x.fav), isFav = !!(favT && favT.fx.includes(k)), hid = this._RES.hid.includes(k), cust = STORE.d.icons && STORE.d.icons[k];
    this._iconFor = k;
    this._popAt(el, `<div class="fxd">${this._ico(u, 52)}<div><b>${esc(this._label(u))}</b><small>${esc(u.rep)}</small></div></div>
      <div class="t">${esc(t('namesOn'))}</div><div class="names">${Object.entries(u.names).map(([id, n]) => `<span><b>${esc(this._name(id))}</b> · ${esc(this._actTxt(n))}</span>`).join('')}</div><hr>
      ${u.custom ? `<button class="it" data-ceedit="${esc(u.custom.id)}">${pi('pen', 's16')}${esc(t('editMine'))}</button>` : ''}
      ${u.custom ? '' : `<button class="it" data-fillopen="${esc(k)}">${pi('sparkles', 's16')}${esc(t('fillT'))}${(this._set().fill || {})[k] ? ` <small>· ${esc(t('fillOn'))}</small>` : ''}</button>`}
      <button class="it" data-script="${esc(k)}">${pi('script', 's16')}${esc(t('script'))}</button>
      ${favT ? `<button class="it" data-fxfav="${esc(k)}">${pi('star', 's16')}${esc(isFav ? t('remFav') : t('addFav'))}</button>` : ''}
      <button class="it" data-fxhide="${esc(k)}">${pi(hid ? 'eye' : 'eyeoff', 's16')}${esc(hid ? t('showFx') : t('hideFx'))}</button>
      <button class="it" data-icup>${pi('upload', 's16')}${esc(t('upIcon'))}</button>
      ${cust ? `<button class="it" data-icrm>${pi('reset', 's16')}${esc(t('rmIcon'))}</button>` : ''}`, { right: true, w: 300 });
  }

  // ---- pointer drag & drop (mouse, pen; touch after a short hold) ----
  _ddown(e) {
    if (e.button > 0) return;
    const it = e.target.closest('[data-d]'); if (!it || e.target.closest('input,button,select,label,.pop,.modal')) return;
    const v = it.dataset.d, i = v.indexOf('|'), zs = it.closest('[data-src]');
    this._dd = { it, type: v.slice(0, i), id: v.slice(i + 1), x: e.clientX, y: e.clientY, on: false, touch: e.pointerType === 'touch', src: zs ? zs.dataset.src : null };
    if (this._dd.touch) { const d = this._dd; d.timer = setTimeout(() => { if (this._dd === d && !d.on) this._dstart(); }, 280); }
  }
  _dstart() {
    const d = this._dd, R = this.shadowRoot; d.on = true; this._closePop();
    d.ids = this._pick.has(d.id) && (d.type === 'fx' || d.type === 'light') ? [...this._pick].filter(k => d.type === 'light' ? k.startsWith('light.') : !k.startsWith('light.')) : [d.id];
    const g = document.createElement('div'); g.className = 'ghost';
    const lbl = d.it.dataset.label || d.it.textContent.trim(), u = d.type === 'fx' && this._U.get(d.id);
    g.innerHTML = (u ? this._ico(u, 30) : d.type === 'light' || d.type === 'cl' ? this._lightDot(d.id) : '') + (d.ids.length > 1 ? `<span class="n">${d.ids.length}</span>` : '') + esc(d.ids.length > 1 ? `${lbl} +${d.ids.length - 1}` : lbl);
    const app = R.querySelector('.app'); app.appendChild(g); d.ghost = g; g.style.transform = `translate(${d.x + 14}px,${d.y + 10}px)`;
    app.classList.add('drag-' + d.type);
    R.querySelectorAll('[data-d]').forEach(el => { const v = el.dataset.d, i = v.indexOf('|'); if (v.slice(0, i) === d.type && d.ids.includes(v.slice(i + 1))) el.classList.add('dragsrc'); });
    if (d.touch && navigator.vibrate) try { navigator.vibrate(10); } catch (e) {}
  }
  _zoneAt(x, y, type) {
    const acc = DND_ACCEPT[type]; let el = this.shadowRoot.elementFromPoint(x, y);
    while (el && el !== this.shadowRoot) {
      const zs = el.dataset && el.dataset.z;
      if (zs) for (const z of zs.split(' ')) { const i = z.indexOf('|'), k = z.slice(0, i); if (acc.includes(k)) return { el, id: z.slice(i + 1), kind: k }; }
      el = el.parentNode;
    }
    return null;
  }
  _insertPoint(z, x, y) {
    if (!z.el.hasAttribute('data-ins')) return null;
    const kids = [...z.el.querySelectorAll(':scope > [data-d]')].filter(k => !this._dd.ids.includes(k.dataset.d.slice(k.dataset.d.indexOf('|') + 1)));
    for (const k of kids) { const r = k.getBoundingClientRect(); if (y < r.top - 5) return k; if (y <= r.bottom + 5 && x < r.left + r.width / 2) return k; }
    return 'end';
  }
  _dmove(e) {
    const d = this._dd; if (!d) return;
    if (!d.on) {
      const dist = Math.hypot(e.clientX - d.x, e.clientY - d.y);
      if (d.touch) { if (dist > 10) { clearTimeout(d.timer); this._dd = null; } return; }
      if (dist < 6) return;
      this._dstart();
    }
    e.preventDefault();
    d.ghost.style.transform = `translate(${e.clientX + 14}px,${e.clientY + 10}px)`;
    this.shadowRoot.querySelectorAll('.over,.ins,.insv').forEach(el => el.classList.remove('over', 'ins', 'insv'));
    const z = this._zoneAt(e.clientX, e.clientY, d.type); d.z = z; d.before = null;
    if (z) {
      const ip = this._insertPoint(z, e.clientX, e.clientY);
      if (ip && ip !== 'end') { ip.classList.add('ins'); d.before = ip.dataset.d.slice(ip.dataset.d.indexOf('|') + 1); }
      else if (ip === 'end') { /* end of the open tab: no extra mark */ }
      else if (z.kind === 'tab' && d.type === 'tab') z.el.classList.add('insv');
      else if (z.kind === 'room' && d.type === 'room') z.el.classList.add('ins');
      else z.el.classList.add('over');
    }
    clearInterval(this._asc);
    const sc = [...this.shadowRoot.querySelectorAll('.grid,.tscroll')].find(el => { const r = el.getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top - 30 && e.clientY <= r.bottom + 30; });
    if (sc) { const r = sc.getBoundingClientRect(), sp = e.clientY < r.top + 40 ? -12 : e.clientY > r.bottom - 40 ? 12 : 0; if (sp) this._asc = setInterval(() => { sc.scrollTop += sp; }, 16); }
  }
  _dup() {
    const d = this._dd; if (!d) return; clearTimeout(d.timer); clearInterval(this._asc); this._dd = null;
    if (!d.on) return;
    d.ghost.remove(); const app = this.shadowRoot.querySelector('.app'); app.classList.remove('drag-' + d.type);
    this.shadowRoot.querySelectorAll('.over,.ins,.insv,.dragsrc').forEach(el => el.classList.remove('over', 'ins', 'insv', 'dragsrc'));
    this._noClick = Date.now();
    if (d.z) this._drop(d.type, d.ids, d.z.kind, d.z.id, d.before, d.src); else this._render();
  }
  _key(e) {
    if (!this.isConnected || !this.shadowRoot) return;
    const tg = e.composedPath()[0], typing = tg && /INPUT|TEXTAREA/.test(tg.tagName);
    if (e.key === 'Escape') { if (this.shadowRoot.querySelector('.pop')) return this._closePop(); if (this._view === 'reset' || this._view === 'restore') { this._bk = null; this._view = 'settings'; return this._render(); } if (this._view === 'settings') { this._view = 'edit'; return this._render(); } if (this._pick.size) { this._pick.clear(); return this._render(); } }
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !typing && this._undo.length) { e.preventDefault(); this._undoIt(); }
  }

  _bind() {
    const R = this.shadowRoot, t = (k, v) => this._t(k, v), app = R.querySelector('.app');
    app.addEventListener('pointerdown', e => this._ddown(e));
    app.addEventListener('click', ev => {
      if (this._noClick && Date.now() - this._noClick < 350) return;
      const g = s => ev.target.closest(s); let x;
      const inPop = g('.pop'); if (!inPop) this._closePop();
      if (g('[data-pv]')) return this._pv ? this._pvEnd(true) : this._pvRoom(this._room);
      if ((x = g('[data-pvend]'))) return this._pvEnd(x.dataset.pvend === '1');
      if (g('[data-undo]')) return this._undoIt();
      if (g('[data-settings]')) { this._view = 'settings'; return this._render(); }
      // own effects editor
      if (g('[data-closece]')) { this._ce = null; return this._render(); }
      if (g('[data-cesave]')) return this._ceSave();
      if (g('[data-cedel]')) return this._ceDelete(this._ce && this._ce.id);
      if ((x = g('[data-ceicons]'))) return this._ceIconPop(x);
      if ((x = g('[data-ceic]'))) { this._closePop(); this._ce.icon = 'c:' + x.dataset.ceic; return this._render(); }
      if ((x = g('[data-ceadd]'))) return this._ceMove([x.dataset.ceadd], true);
      if ((x = g('[data-cerem]'))) return this._ceMove([x.dataset.cerem], false);
      if ((x = g('[data-ceaddr]'))) return this._ceMove((this._M.by[x.dataset.ceaddr] || []).slice(), true);
      if ((x = g('[data-cenew]'))) return this._ceOpen(null);
      if ((x = g('[data-fillopen]'))) return this._fillOpen(x.dataset.fillopen);
      if (g('[data-fillclose]')) { this._fill = null; return this._render(); }
      if (g('[data-fillsave]')) return this._fillSave();
      if (g('[data-filldel]')) return this._fillDelete();
      if ((x = g('[data-ceedit]'))) return this._ceOpen(x.dataset.ceedit);
      // reset
      if (g('[data-resetask]')) { this._view = 'reset'; return this._render(); }
      if ((x = g('[data-closereset]')) && (x.classList.contains('btn') || !g('.dlg'))) { this._view = 'settings'; return this._render(); }
      if (g('[data-resetyes]')) return this._resetAll();
      if (g('[data-reload]')) { try { if (navigator.serviceWorker) navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.update())); } catch (e) {} Promise.resolve(window.__LEMUR_HEAL && window.__LEMUR_HEAL()).finally(() => setTimeout(() => location.reload(), 150)); return; }
      if (g('[data-bkdown]')) return this._backupDown();
      if (g('[data-bkup]')) { const f = R.getElementById('bkf'); if (f) f.click(); return; }
      if ((x = g('[data-closerestore]')) && (x.classList.contains('btn') || !g('.dlg'))) { this._bk = null; this._view = 'settings'; return this._render(); }
      if (g('[data-bkyes]')) return this._backupApply();
      if (this._view === 'restore' && g('.dlg')) return;
      if (this._view === 'reset' && g('.dlg')) return;
      if ((x = g('[data-closeset]')) && (x.classList.contains('btn') || !g('.dlg'))) { this._view = 'edit'; return this._render(); }
      // settings
      if ((x = g('[data-k]'))) return this._save({ kelvin: +x.dataset.k });
      if ((x = g('[data-lang]'))) return this._save({ language: x.dataset.lang === 'auto' ? null : x.dataset.lang });
      if ((x = g('[data-min]'))) return this._save({ min_effects: +x.dataset.min });
      if ((x = g('[data-sv]'))) { const v = x.dataset.sv, i = v.indexOf('|'), key = v.slice(0, i), raw = v.slice(i + 1), num = /^\d+(\.\d+)?$/.test(raw) ? +raw : raw; const def = { tile_size: 'auto', icon_style: 'color', bg: 'dark', start_tab: 'auto', long_press: 550, fx_on_brightness: 0, night_max: 30, transition: 0 }[key]; return this._save({ [key]: num === def ? null : num }); }
      if ((x = g('[data-sw]'))) { const [key, d] = x.dataset.sw.split('|'), def = d === '1', S = this._set(), cur = S[key] == null ? def : !!S[key], nv = !cur; return this._save({ [key]: nv === def ? null : nv }); }
      if ((x = g('[data-roff]'))) { this._closePop(); return this._roomVis(x.dataset.roff || this._room); }
      if (g('.dlg')) return;
      // rooms and lights
      if ((x = g('[data-room]')) && !g('button')) { this._ce = null; this._fill = null; this._room = x.dataset.room; this._tab[this._room] = '_allfx'; this._pick.clear(); this._q = ''; if (this._pv) this._pvRoom(this._room); return this._render(); }
      if ((x = g('[data-addroom]'))) return this._addRoomPop(x);
      if ((x = g('[data-pickroom]'))) { this._extra = x.dataset.pickroom; this._room = this._extra; this._closePop(); return this._render(); }
      if ((x = g('[data-addlight]'))) return this._addLightPop(x);
      if ((x = g('[data-takel]'))) { this._closePop(); return this._moveLights([x.dataset.takel], this._room); }
      if ((x = g('[data-more]'))) return this._morePop(x);
      if ((x = g('[data-riconpop]'))) return this._roomIconPop(R.querySelector('[data-more]') || x);
      if ((x = g('[data-ricon]'))) return this._setRoomIcon(x.dataset.ricon);
      if (g('[data-riapply]')) { const q = R.getElementById('riq'), v = q && q.value.trim(); return this._setRoomIcon(/^[a-z]+:[\w-]+$/.test(v || '') ? v : ''); }
      if ((x = g('[data-script]'))) { this._closePop(); return this._scripts(this._room, [x.dataset.script]); }
      if (g('[data-scriptfav]')) { const f = this._RES.tabs.find(q => q.fav); return f && this._scripts(this._room, f.fx.slice()); }
      if (g('[data-reset]')) { this._closePop(); this._snap(); saveRoomCfg(this._room, null); return this._toast(t('resetDone')); }
      if ((x = g('[data-copyto]'))) {
        this._closePop();
        const M = this._M, src = this._RES, to = x.dataset.copyto === '*' ? M.order.filter(r => r !== this._room && r !== '_all') : [x.dataset.copyto];
        this._snap();
        const T = Object.assign({}, STORE.d.tabs || {});
        to.forEach(r => {
          const U2 = this._effects(this._lightsOf(M, r));
          T[r] = { tabs: src.tabs.map(q => { const o = { id: q.id, fx: q.fx.filter(k => U2.has(k)) }; ['name', 'icon', 'fav', 'auto'].forEach(f => { if (q[f] != null) o[f] = q[f]; }); if (!o.name && !o.fav && !o.auto) o.name = this._tabName(q); return o; }), hid: src.hid.filter(k => U2.has(k)) };
          if (this._lightIcon()) T[r].light_icon = this._lightIcon();
        });
        STORE.set('tabs', T);
        return this._toast(t('copied', { r: to.length > 1 ? t('toAll') : t('toRoom', { r: this._roomName(to[0]) }) }));
      }
      // tabs
      if ((x = g('[data-edtab]'))) { ev.stopPropagation(); return this._editTabPop(x.closest('.tb'), x.dataset.edtab); }
      if ((x = g('[data-ticon]'))) {
        const [id, ic] = x.dataset.ticon.split('|'); this._closePop();
        return this._edit(this._room, cfg => {
          if (id === '_light') { if (ic) cfg.light_icon = ic; else delete cfg.light_icon; return; }
          const q = cfg.tabs.find(y => y.id === id); if (!q) return false; if (ic) q.icon = ic; else delete q.icon;
        });
      }
      if ((x = g('[data-tdel]'))) {
        const id = x.dataset.tdel, nm = this._tabName(this._RES.tabs.find(q => q.id === id) || { id }); this._closePop();
        return this._edit(this._room, cfg => { const q = cfg.tabs.find(y => y.id === id); if (!q || q.fav) return false; cfg.hid = [...cfg.hid, ...q.fx.filter(k => !cfg.hid.includes(k))]; cfg.tabs = cfg.tabs.filter(y => y !== q); }, t('tabDel', { t: nm }));
      }
      if ((x = g('[data-addtab]'))) return this._addTabPop(x);
      if ((x = g('[data-addt]'))) {
        const v = x.dataset.addt, U = this._U, grp = this._grp(U); this._closePop();
        if (v === '_empty') { const id = newId(); this._edit(this._room, cfg => { cfg.tabs.push({ id, name: t('newTab'), fx: [] }); }); this._tab[this._room] = id; this._render(); const el = this.shadowRoot.querySelector(`[data-tabsel="${id}"]`); if (el) this._editTabPop(el, id); return; }
        if (v.startsWith('g:')) { const gk = v.slice(2); this._copyTab({ id: 'g_' + gk, auto: gk, name: GNAME[this._l()][gk], fx: [...U.keys()].filter(k => grp(k) === gk) }, this._room); return this._toast(t('tabAdded', { t: GNAME[this._l()][gk] })); }
        const p = v.split(':'), r = p[1], id = p.slice(2).join(':'), M = this._M, src = this._resolve(r, this._effects(this._lightsOf(M, r))).tabs.find(q => q.id === id);
        if (src) { this._copyTab(src, this._room); this._toast(t('tabAdded', { t: this._tabName(src) })); }
        return;
      }
      if ((x = g('[data-tabsel]')) && !g('button')) { this._fill = null; if (x.dataset.tabsel !== '_mine') this._ce = null; this._tab[this._room] = x.dataset.tabsel; this._pick.clear(); this._q = ''; return this._render(); }
      // effects
      if ((x = g('[data-fxm]'))) { ev.stopPropagation(); return this._fxPop(x, x.dataset.fxm); }
      if ((x = g('[data-fxfav]'))) {
        const k = x.dataset.fxfav, favT = this._RES.tabs.find(q => q.fav); this._closePop(); if (!favT) return;
        if (favT.fx.includes(k)) return this._edit(this._room, cfg => { const f = cfg.tabs.find(q => q.fav); f.fx = f.fx.filter(q => q !== k); }, t('saved'));
        return this._moveFx([k], favT.id);
      }
      if ((x = g('[data-fxhide]'))) {
        const k = x.dataset.fxhide, U = this._U; this._closePop();
        if (!this._RES.hid.includes(k)) return this._moveFx([k], '_hid');
        return this._edit(this._room, cfg => { cfg.hid = cfg.hid.filter(q => q !== k); }, t('shownFx', { x: this._label(U.get(k)) }));
      }
      if (g('[data-icup]')) { this._closePop(); const f = R.getElementById('icf'); if (f) f.click(); return; }
      if (g('[data-icrm]')) { this._closePop(); STORE.iconDel(this._iconFor); return; }
      if (g('[data-clr]')) { this._pick.clear(); return this._render(); }
      // lights: × takes a light out of the room, a click opens what can be done with it
      if ((x = g('[data-lout]'))) { ev.stopPropagation(); this._closePop(); return this._lightOut(x.dataset.lout); }
      if ((x = g('[data-lfx]'))) { const id = x.dataset.lfx, S = this._set(), U = Object.assign({}, S.fx_use), want = !this._fxOn(id); delete U[id]; if (fxOn(Object.assign({}, S, { fx_use: U }), id, this._fxCount(id)) !== want) U[id] = want; this._closePop(); return this._save({ fx_use: Object.keys(U).length ? U : null }, want ? null : null); }
      if ((x = g('[data-lto]'))) { const [id, to] = x.dataset.lto.split('|'); this._closePop(); return this._moveLights([id], to); }
      if ((x = g('[data-lmenu]')) && !inPop) return this._lightPop(x, x.dataset.lmenu);
      if ((x = g('[data-d]')) && !g('button,input') && !inPop) {
        const v = x.dataset.d, i = v.indexOf('|'), type = v.slice(0, i), id = v.slice(i + 1); if (type !== 'fx') return;
        // preview on: a click plays the effect instead of selecting it
        if (this._pv) return this._pvPlay(id);
        const vis = [...x.parentElement.querySelectorAll(':scope > [data-d]')].filter(el => el.style.display !== 'none' && el.dataset.d.startsWith(type + '|')).map(el => el.dataset.d.slice(i + 1));
        [...this._pick].forEach(k => { if ((type === 'light') !== k.startsWith('light.')) this._pick.delete(k); });
        if (ev.shiftKey && this._last && vis.includes(this._last)) { const a = vis.indexOf(this._last), b = vis.indexOf(id); vis.slice(Math.min(a, b), Math.max(a, b) + 1).forEach(q => this._pick.add(q)); }
        else this._pick.has(id) ? this._pick.delete(id) : this._pick.add(id);
        this._last = id; return this._render();
      }
    });
    app.addEventListener('contextmenu', e => { const tl = e.target.closest('.fx[data-d]'); if (!tl) return; e.preventDefault(); const v = tl.dataset.d; this._fxPop(tl, v.slice(v.indexOf('|') + 1)); });
    app.addEventListener('input', e => {
      if (e.target.id === 'aq') { this._q = e.target.value; this._filterAll(); }
      if (e.target.id === 'gb') { const bv = R.getElementById('bv'); if (bv) bv.textContent = '%' + e.target.value; }
      if (e.target.id === 'cename' && this._ce) this._ce.name = e.target.value;
      if (e.target.id === 'ceiq') { const v = e.target.value.toLocaleLowerCase(this._l()).trim(); R.querySelectorAll('#ceig button').forEach(b => { b.style.display = !v || b.dataset.n.includes(v) ? '' : 'none'; }); }
    });
    app.addEventListener('change', e => {
      const x = e.target;
      if (x.id === 'gb') return this._save({ brightness: +x.value });
      if (x.id === 'nf' || x.id === 'nt') return this._save({ [x.id === 'nf' ? 'night_from' : 'night_to']: x.value || null });
      if (x.id === 'bkf') {
        const f = x.files && x.files[0]; x.value = ''; if (!f) return;
        const rd = new FileReader(); rd.onload = () => { let b = null; try { b = JSON.parse(rd.result); } catch (e) {} if (!b || b.format !== 'lemur-light-effects-backup' || !b.data) return this._toast(this._t('bkErr'), false); this._bk = b; this._view = 'restore'; this._render(); }; rd.readAsText(f); return;
      }
      if (this._fill) {
        const d = x.dataset, F = this._fill;
        if (d.fm) { const nv = x.value, light = d.fm === '_all' ? null : d.fm; const v = nv === 'auto' || nv === 'skip' || nv === 'off' ? { mode: nv } : this._ceDefault(nv, light); if (nv === 'color' && d.fm !== '_all' && F.cfg.all && F.cfg.all.rgb) v.rgb = F.cfg.all.rgb.slice(); if (d.fm === '_all') F.cfg.all = v; else { F.cfg.lights = F.cfg.lights || {}; F.cfg.lights[d.fm] = v; } return this._render(); }
        if (d.ffx) { this._fillSlot(d.ffx).fx = x.value; return; }
        if (d.frgb) { this._fillSlot(d.frgb).rgb = hexRgb(x.value); return; }
        if (d.fk) { this._fillSlot(d.fk).k = +x.value; return; }
        if (d.fbr) { const v = Math.max(1, Math.min(100, Math.round(+x.value || 0))); const sl = this._fillSlot(d.fbr); if (x.value === '' || !v) delete sl.br; else sl.br = v; return; }
      }
      if (this._ce) {
        const c = this._ce, d = x.dataset;
        if (x.id === 'cebase') { const A = this._allFx(); c.base = x.value; c.base_name = x.value ? A.get(x.value) || '' : ''; return this._render(); }
        if (d.cm) { const nv = x.value; if (d.cm === '_fb') c.fallback = this._ceDefault(nv); else { c.lights = c.lights || {}; c.lights[d.cm] = this._ceDefault(nv, d.cm); } return this._render(); }
        if (d.cfx) { this._ceSlot(d.cfx).fx = x.value; return; }
        if (d.crgb) { this._ceSlot(d.crgb).rgb = hexRgb(x.value); return; }
        if (d.ck) { this._ceSlot(d.ck).k = +x.value; return; }
        if (d.cbr) { const v = Math.max(1, Math.min(100, Math.round(+x.value || 0))); const sl = this._ceSlot(d.cbr); if (x.value === '' || !v) delete sl.br; else sl.br = v; return; }
      }
      if (x.dataset.tname) {
        if (x.dataset.done) return; x.dataset.done = '1';
        const id = x.dataset.tname, v = x.value.trim(), cur = this._RES.tabs.find(q => q.id === id);
        if (!cur || !v || v === this._tabName(cur)) return;
        this._closePop(); this._edit(this._room, cfg => { const q = cfg.tabs.find(y => y.id === id); if (!q) return false; q.name = v; }, t('saved'));
      }
    });
    app.addEventListener('keydown', e => { if (e.target.dataset && e.target.dataset.tname && e.key === 'Enter') { e.preventDefault(); e.target.dispatchEvent(new Event('change', { bubbles: true })); this._closePop(); } });
    const icf = R.getElementById('icf');
    if (icf) icf.onchange = async () => {
      const f = icf.files && icf.files[0], k = this._iconFor; if (!f || !k) return;
      try { await STORE.icon(k, 'image/png', await toPngB64(f)); this._toast(t('iconSaved'), false); } catch (e) { this._toast(t('iconErr'), false); }
    };
  }
}
