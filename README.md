# KidLearn Pro — Android App (Capacitor + GitHub Actions)

## Tallaabooyinka (Somali)

### 1. Geli AdMob App ID-gaaga (ikhtiyaari, laakiin lama filaan)
GitHub repo-gaaga:
1. Tag `Settings` → `Secrets and variables` → `Actions`
2. Riix `New repository secret`
3. Name: `ADMOB_APP_ID`
4. Value: AdMob App ID-gaaga (tusaale: `ca-app-pub-1234567890123456~1234567890`)
5. Save

Haddii aadan geliso, app-ku wuu dhisi doonaa **iyada oo AdMob aan ku jirin** — waad ku dari kartaa mar dambe.

### 2. Push gareey files-kan GitHub repo-gaaga
Folder-kan oo dhan (`kidlearn-pro/`) waxaad ku dejisaa repo-gaaga `KidLearnPro` (ama mid cusub).

### 3. Sug GitHub Actions
Mar walba aad push gareyso `main` branch-ka, GitHub Actions wuu si toos ah u bilaabi doonaa build-ka. Waxaad ka eegi kartaa tab-ka **Actions** ee repo-gaaga.

Waxay qaadan doontaa ~5-10 daqiiqo.

### 4. Download APK-ga
Marka build-ku dhammaado:
1. Tag tab-ka **Actions**
2. Dooro build-kii ugu dambeeyay (ee leh ✅ green)
3. Hoosta bogga, waxaad ka heli doontaa **Artifacts**:
   - `KidLearnPro-debug-apk` — kani waa mid aad si dhakhso ah test ugu samayn karto
   - `KidLearnPro-release-unsigned-apk` — kani waa kan loogu talagalay Play Store, laakiin waa inuu marka hore la **sign** gareeyo (saxiixo) ka hor inta aadan Play Store geynin

### 5. Install/Test
- Debug APK-ga si toos ah ayaad mobile-kaaga ugu rakibi kartaa (download → install)
- Haddii aad u baahan tahay Play Store, waxaad u baahan doontaa inaad sameyso "signed" release — waan ku caawin karaa tan marka aad diyaar u tahay

## AdMob — sida loo isticmaalo

App-ku wuxuu si toos ah ugu darayaa AdMob SDK-ga (`play-services-ads`) Android project-ka. Si aad u muujiso banner/interstitial ads dhabta ah, waxaad u baahan doontaa inaad ku darto JavaScript code oo isticmaalaya Capacitor AdMob plugin (`@capacitor-community/admob`) — kani waa tallaabo xigta ee aan kuu sameyn karo marka asaaska uu shaqeeyo.

## Su'aal ama dhibaato?
Haddii build-ku fashilmo (❌ cay), copy-paste error-ka GitHub Actions logs-ka oo ii soo dir, waan kuu xallin doonaa.
