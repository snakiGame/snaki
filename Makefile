start:
	npx expo start

dev: prebuild
	eas build --platform android --profile dev

prebuild:
	npx expo prebuild --clean