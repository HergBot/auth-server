SET @HergBotServiceId = orderedUuid(UUID());

INSERT INTO Service (Service_Id, Name, Created) VALUES
(0x11EDB436EEA9FAFCACE62CF05D559498, 'Herg Bot Auth Service', CURRENT_TIMESTAMP);