/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   AI TEACHER HUB — 3D MAGIC ENGINE
   المسؤول عن الكتاب الـ 3D والخلفية التفاعلية
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

let scene, camera, renderer, book, particles, cloud;

function init3D() {
    // 1. إعداد المشهد
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // إنشاء حاوية للـ 3D
    const container = document.createElement('div');
    container.id = 'canvas-container';
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    // 2. الإضاءة (عشان الكتاب يظهر بظلال احترافية)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0x8b5cf6, 2);
    spotLight.position.set(5, 10, 7);
    scene.add(spotLight);

    // 3. صناعة الكتاب (المجسم)
    const bookGroup = new THREE.Group();
    
    // الغلاف (البنفسجي)
    const coverGeom = new THREE.BoxGeometry(3.2, 4.2, 0.1);
    const coverMat = new THREE.MeshPhongMaterial({ color: 0x7c3aed, shininess: 100 });
    const cover = new THREE.Mesh(coverGeom, coverMat);
    bookGroup.add(cover);

    // الصفحات (كتلة بيضاء جوه الغلاف)
    const pageGeom = new THREE.BoxGeometry(3, 4, 0.25);
    const pageMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const pages = new THREE.Mesh(pageGeom, pageMat);
    pages.position.z = 0.15;
    bookGroup.add(pages);

    scene.add(bookGroup);
    book = bookGroup;
    book.position.set(window.innerWidth > 768 ? 3 : 0, 0, 0); // مكانه على اليمين في الشاشات الكبيرة

    // 4. جزيئات الخلفية (الـ Particles "البوم")
    const particlesGeom = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);

    for(let i=0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 15;
    }
    particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMat = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x10b981, // لون المينت المبهج
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particles);

    camera.position.z = 6;

    // 5. الأنيميشن مع الـ Scroll (باستخدام GSAP)
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(book.rotation, {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        },
        y: Math.PI * 2, // يلف لفة كاملة
        x: 0.5,
        z: 0.2
    });

    gsap.to(book.position, {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        },
        x: -2, // يتحرك للشمال وهو نازل
        y: -1
    });

    // 6. التفاعل مع الماوس
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        
        gsap.to(particles.rotation, { y: x * 0.5, x: -y * 0.5, duration: 2 });
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if(particles) particles.rotation.y += 0.001;
    renderer.render(scene, camera);
}

// تعديل المقاس عند تغيير حجم الشاشة
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// تشغيل المحرك
init3D();