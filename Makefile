start:
	npx expo start

dev: prebuild
	eas build --platform android --profile dev

build-apk: prebuild
	eas build --platform android --profile preview

prebuild:
	npx expo prebuild --clean