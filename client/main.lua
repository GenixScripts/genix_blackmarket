local QBCore = exports['qb-core']:GetCoreObject()
local display = false

RegisterNetEvent('genix_blackmarket:client:openBlackMarket')
AddEventHandler('genix_blackmarket:client:openBlackMarket', function()
    if not display then
        local Player = QBCore.Functions.GetPlayerData()
        local cash = Player.money['cash']
        SetDisplay(true, cash)
    end
end)

RegisterNUICallback("exit", function(data)
    SetDisplay(false)
end)

RegisterNUICallback("buyItem", function(data, cb)
    TriggerServerEvent('genix_blackmarket:server:buyItem', data.item, data.amount)
    cb('ok')
end)

function SetDisplay(bool, cash)
    display = bool
    SetNuiFocus(bool, bool)
    SendNUIMessage({
        type = "ui",
        status = bool,
        items = Config.Items,
        cash = cash or 0
    })
end

CreateThread(function()
    for _, location in pairs(Config.NPCLocations) do
        RequestModel(GetHashKey(location.model))
        while not HasModelLoaded(GetHashKey(location.model)) do
            Wait(1)
        end
        
        local npc = CreatePed(4, location.model, location.coords.x, location.coords.y, location.coords.z - 1, location.coords.w, false, true)
        FreezeEntityPosition(npc, true)
        SetEntityInvincible(npc, true)
        SetBlockingOfNonTemporaryEvents(npc, true)
        
        if location.scenario then
            TaskStartScenarioInPlace(npc, location.scenario, 0, true)
        end

        exports['qb-target']:AddTargetEntity(npc, {
            options = {
                {
                    type = "client",
                    event = "genix_blackmarket:client:openBlackMarket",
                    icon = "fas fa-shop",
                    label = "Open Black Market",
                }
            },
            distance = 2.0
        })
    end
end)

