<template>
  <div class="bg-gray-600 w-256 h-screen p-8 flex flex-col gap-8 select-none shadow-4-lg">
    <div>
      <SettingsCard @click="account()"/>
      <DropdownSettings :is-open="isOpen"/>
    </div>
    <StatusCard/>

    <ServerListCard :server-list="serverList"/>
  </div>
</template>

<script setup>
import SettingsCard from "@/components/Sidebar/settings/SettingsCard.vue";
import StatusCard from "@/components/Sidebar/StatusCard.vue";
import DropdownSettings from "@/components/Sidebar/settings/DropdownSettings.vue";
import ServerListCard from "@/components/Sidebar/serverList/ServerListCard.vue";
</script>

<script>
export default {
  data() {
    return {
      isOpen: false,
      serverList: {
        "suggest": {
          "Germany": {
            "tag": "de",
            "server": {
              "Düsseldorf": {
                id: 1,
              },
              "Frankfurt": {
                id: 2,
              }
            }
          }
        },
        "other": {
          "Argentina": {
            "tag": "ar",
            "server": {
              "Buenos Aires": {
                id: 1,
              },
              "Cordoba": {
                id: 2,
              },
              "Rosario": {
                id: 3,
              },
              "Mendoza": {
                id: 4,
              },
            }
          },
          "Brasile": {
            "tag": "br",
            "server": {
              "Sao Paulo": {
                id: 1,
              },
              "Rio de Janeiro": {
                id: 2,
              },
              "Belo Horizonte": {
                id: 3,
              },
              "Salvador": {
                id: 4,
              },
            }
          },
          "Canada": {
            "tag": "ca",
            "server": {
              "Toronto": {
                id: 1,
              },
              "Montreal": {
                id: 2,
              },
              "Vancouver": {
                id: 3,
              },
              "Calgary": {
                id: 4,
              },
            }
          },
          "Cina": {
            "tag": "cn",
            "server": {
              "Shanghai": {
                id: 1,
              },
              "Beijing": {
                id: 2,
              },
              "Guangzhou": {
                id: 3,
              },
              "Shenzhen": {
                id: 4,
              },
            }
          },
          "Francia": {
            "tag": "fr",
            "server": {
              "Paris": {
                id: 1,
              },
              "Marseille": {
                id: 2,
              },
              "Lyon": {
                id: 3,
              },
              "Toulouse": {
                id: 4,
              },
            }
          },
          "Germania": {
            "tag": "de",
            "server": {
              "Düssendorf": {
                id: 1,
              },
              "Frankfurt": {
                id: 2,
              },
              "Munich": {
                id: 3,
              },
              "Hamburg": {
                id: 4,
              },
            }
          },
          "India": {
            "tag": "in",
            "server": {
              "Mumbai": {
                id: 1,
              },
              "Delhi": {
                id: 2,
              },
              "Bangalore": {
                id: 3,
              },
              "Hyderabad": {
                id: 4,
              },
            }
          },
          "Italia": {
            "tag": "it",
            "server": {
              "Roma": {
                id: 1,
              },
              "Milano": {
                id: 2,
              },
              "Napoli": {
                id: 3,
              },
              "Torino": {
                id: 4,
              },
              "Vari": {
                id: 5,
              },
            }
          },
          "Giappone": {
            "tag": "jp",
            "server": {
              "Tokyo": {
                id: 1,
              },
              "Osaka": {
                id: 2,
              },
              "Kyoto": {
                id: 3,
              },
              "Sapporo": {
                id: 4,
              },
            }
          },
        }
      },
    }
  },
  methods: {
    account() {
      this.isOpen = !this.isOpen;
    }
  }
}
</script>

