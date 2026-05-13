set dotenv-load

dep:
    npm install

dev:
    npm run dev

build:
    npm run build

build-container:
    @just build
    podman build -t maze-3d -f Containerfile .

release-patch:
    release-it -i patch

release-minor:
    release-it -i minor

release-major:
    release-it -i major

release-dry:
    release-it --dry-run
