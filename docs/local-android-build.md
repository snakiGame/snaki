# Building Expo Android APK Locally (No Android Studio)

## Prerequisites

- macOS 10.15+
- Homebrew installed
- Node.js + bun already set up

## 1. Install JDK 17

```bash
brew install openjdk@17
sudo ln -sfn $(brew --prefix openjdk@17)/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

Add to `~/.zshrc`:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

Verify:

```bash
source ~/.zshrc
java -version  # Should show 17.x
```

## 2. Install Android SDK (Command-Line Tools Only)

```bash
brew install --cask android-commandlinetools
```

Install required SDK components:

```bash
sdkmanager --sdk_root=$HOME/Android/sdk \
  "platform-tools" \
  "platforms;android-36" \
  "build-tools;36.0.0" \
  "ndk;27.1.12297006" \
  "cmake;3.22.1"
```

Accept all licenses:

```bash
yes | sdkmanager --licenses --sdk_root=$HOME/Android/sdk
```

Add to `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Android/sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

Then reload:

```bash
source ~/.zshrc
```

## 3. Build the APK

### First time (or after adding native modules)

```bash
npx expo prebuild --platform android --clean
```

### Build release APK

```bash
cd android && ./gradlew assembleRelease
```

APK output: `android/app/build/outputs/apk/release/app-release.apk`

### Using Makefile

```bash
make build-local
```

## 4. Install on Device

Connect your Android device via USB with USB debugging enabled:

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

Or transfer the APK file directly to your phone.

## RAM & Disk Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| RAM      | 8 GB    | 16 GB       |
| Disk     | 15 GB   | 25 GB       |

- First build: ~10-15 min (8 GB RAM) / ~5-8 min (16 GB RAM)
- Subsequent builds: ~3-5 min (uses Gradle cache)
- Close memory-heavy apps (Chrome) during builds on 8 GB machines

## Troubleshooting

### Out of memory

Add to `android/gradle.properties`:

```properties
org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m
```

### SDK not found

Make sure `ANDROID_HOME` is set:

```bash
echo $ANDROID_HOME  # Should print ~/Android/sdk
```

### License not accepted

```bash
yes | sdkmanager --licenses --sdk_root=$ANDROID_HOME
```

### Clean build (reset caches)

```bash
cd android && ./gradlew clean
```

Or full reset:

```bash
rm -rf android/app/build android/.gradle
cd android && ./gradlew assembleRelease
```
