# 3D-друк: шкільний слайсер EduProstir

Слайсер для курсу 3D-друку на [eduprostir.com](https://eduprostir.com): учень відкриває модель
(наприклад, з 3D-майстерні), вибирає шкільний принтер і отримує G-code для друку. Усе працює
в браузері, нічого не треба встановлювати.

Це форк [Kiri:Moto](https://github.com/GridSpace/grid-apps) (Stewart Allen, grid.space) під ліцензією MIT.
Оригінальний README: [README.upstream.md](README.upstream.md). Що змінено: [NOTICE.md](NOTICE.md).

## Збірка

```sh
npm ci
npm run build   # статичні файли в dist/
npm test
```

`dist/` можна віддавати будь-яким вебсервером під будь-яким шляхом (на сайті це `/slicer/`).
Сервер має віддавати заголовки `Cross-Origin-Opener-Policy: same-origin` і
`Cross-Origin-Embedder-Policy: require-corp`: без них нарізка працює в одному потоці й повільніше.

## Переклад

Українські рядки лежать у `tools/uk_strings.py`. Після зміни: `npm run uk` (оновлює `web/kiri/lang/uk.js`).
