const routes = [
  {
    path: "/",
    component: () => import("layouts/LandingPage.vue"),
    children: [
      { path: "", component: () => import("pages/LandingPage/Index.vue") }
    ]
  },

  {
    path: "/guru",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/", component: () => import("pages/Guru/Index.vue") },
      { path: "id/:id", component: () => import("pages/Guru/Profile.vue") },
      { path: "cari/:id", component: () => import("pages/Guru/Cari.vue") }
    ]
  },

  {
    path: "/masjid",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/", component: () => import("pages/Masjid/Index.vue") },
      { path: "id/:id", component: () => import("pages/Masjid/Profile.vue") },
      { path: "cari/:id", component: () => import("pages/Masjid/Cari.vue") }
    ]
  },

  {
    path: "/kajian",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/", component: () => import("pages/Kajian/Index.vue") },
      { path: "id/:id", component: () => import("pages/Kajian/Profile.vue") },
      { path: "cari/:id", component: () => import("pages/Kajian/Cari.vue") }
    ]
  },

  {
    path: "/login",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "/", component: () => import("pages/Auth/Login.vue") }]
  },

  {
    path: "/AdminGuru",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "dashboard",
        component: () => import("pages/AdminGuru/Index.vue")
      }
    ]
  },

  {
    path: "/AdminMasjid",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/", redirect: "dashboard" },
      {
        path: "dashboard",
        component: () => import("pages/AdminMasjid/Index.vue")
      },
      {
        path: "masjid",
        component: () => import("pages/SuperAdmin/Masjid.vue")
      },
      {
        path: "kajian",
        component: () => import("pages/SuperAdmin/Kajian.vue")
      },
      { path: "flyer", component: () => import("pages/Flyer/Index.vue") }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: "/AdminGuru",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/", redirect: "dashboard" },
      {
        path: "dashboard",
        component: () => import("pages/AdminGuru/Index.vue")
      },
      {
        path: "guru",
        component: () => import("pages/SuperAdmin/Guru.vue")
      },
      {
        path: "kajian",
        component: () => import("pages/SuperAdmin/Kajian.vue")
      },
      { path: "flyer", component: () => import("pages/Flyer/Index.vue") }
    ],
    meta: { requiresAuth: true }
  },

  {
    path: "/SuperAdmin",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "dashboard",
        component: () => import("pages/SuperAdmin/Index.vue")
      },
      {
        path: "admin-guru",
        component: () => import("pages/SuperAdmin/KelolaAdmin/AdminGuru.vue")
      },
      {
        path: "admin-masjid",
        component: () => import("pages/SuperAdmin/KelolaAdmin/AdminMasjid.vue")
      },
      {
        path: "guru",
        component: () => import("pages/SuperAdmin/Guru.vue")
      },
      {
        path: "masjid",
        component: () => import("pages/SuperAdmin/Masjid.vue")
      },
      {
        path: "kajian",
        component: () => import("pages/SuperAdmin/Kajian.vue")
      },
      {
        path: "flyer",
        component: () => import("pages/Flyer/Index.vue")
      },
      {
        path: "notifikasi",
        component: () => import("pages/Notifikasi/Index.vue")
      }
    ],
    meta: { requiresAuth: true }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
