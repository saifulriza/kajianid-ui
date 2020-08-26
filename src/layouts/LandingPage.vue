<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="left = !left"
          class="q-ma-sm"
        />

        <q-toolbar-title class="flex flex-center">
          <q-avatar>
            <img src="~assets/logo6.png" />
          </q-avatar>
          InfoKajian
        </q-toolbar-title>
        <q-btn-dropdown
          v-if="user !== null"
          flat
          dropdown-icon="apps"
          dense
          round
        >
          <div class="row no-wrap q-pa-md">
            <div class="column">
              <div class="text-h6 q-mb-md">{{ user.email }}</div>
              <q-btn flat color="primary" label="Dashboard" :to="dashboard" />
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            <div class="column items-center">
              <q-avatar size="72px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">{{ user.name }}</div>

              <q-btn
                color="primary"
                label="Logout"
                push
                size="sm"
                v-close-popup
                @click="logout()"
              />
            </div>
          </div>
        </q-btn-dropdown>
        <q-btn
          v-if="user == null"
          icon="login"
          dense
          flat
          round
          class="q-ma-sm"
          to="/login"
        />

        <q-btn dense flat round icon="menu" @click="right = !right" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="right" side="right" bordered>
      <q-scroll-area
        :thumb-style="thumbStyle"
        :bar-style="barStyle"
        style="height: 100%; max-width: 100%;"
      >
        <GuruComponent />
      </q-scroll-area>
    </q-drawer>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <q-scroll-area
        :thumb-style="thumbStyle"
        :bar-style="barStyle"
        style="height: 100%; max-width: 100%;"
      >
        <MasjidComponent />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar class="bg-grey-8 text-white shadow-2 rounded-borders" @click="$router.push('/dev')">
        InfoKajian © {{ new Date().getFullYear() }} 
        <q-space />

        <!--
        notice shrink property since we are placing it
        as child of QToolbar
      -->
        <!-- <q-tabs v-model="tab" shrink>
          <q-tab name="tab1" label="Tab 1" />
          <q-tab name="tab2" label="Tab 2" />
          <q-tab name="tab3" label="Tab 3" />
        </q-tabs> -->
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import User from 'models/User';
import GuruComponent from "components/GuruComponent.vue";
import MasjidComponent from "components/MasjidComponent.vue";

export default {
  components: {
    GuruComponent,
    MasjidComponent
  },
  data() {
    return {
      dashboard: {},
      user: {},
      tab: "",
      left: false,
      right: false,
      thumbStyle: {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "7px",
        opacity: 0.75
      },

      barStyle: {
        right: "2px",
        borderRadius: "9px",
        backgroundColor: "#027be3",
        width: "11px",
        opacity: 0.2
      }
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("K0lgfWr");
      localStorage.removeItem("kode_r");
      localStorage.removeItem("kode_e");
      localStorage.removeItem("dashboard");
      return window.location.reload();
    }
  },
  async created() {
    this.user = JSON.parse(
      localStorage.getItem("user") ? localStorage.getItem("user") : null
    );
    this.dashboard = JSON.parse(
      localStorage.getItem("dashboard")
        ? localStorage.getItem("dashboard")
        : null
    );
  }
};
</script>
