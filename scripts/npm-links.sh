pkgDir="$PWD/packages"

cd "$pkgDir/drafterbit" && npm link
cd "$pkgDir/cli" && npm link && npm link drafterbit
cd "$pkgDir/create/app" && npm link drafterbit && npm link '@drafterbit/cli'