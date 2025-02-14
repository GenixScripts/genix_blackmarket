local QBCore = exports['qb-core']:GetCoreObject()

RegisterNetEvent('genix_blackmarket:server:buyItem')
AddEventHandler('genix_blackmarket:server:buyItem', function(itemData, amount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    
    if not Player or not itemData then return end
    
    local price = itemData.price * amount
    
    if Player.PlayerData.money['cash'] >= price then
        if Player.Functions.AddItem(itemData.name, amount) then
            Player.Functions.RemoveMoney('cash', price, "black-market-purchase")
            TriggerClientEvent('QBCore:Notify', src, "Purchase successful!", "success")
        else
            TriggerClientEvent('QBCore:Notify', src, "Not enough inventory space!", "error")
        end
    else
        TriggerClientEvent('QBCore:Notify', src, "Not enough cash!", "error")
    end
end)

