SET @ServiceTokenId = orderedUuid(UUID());

INSERT INTO ServiceToken (Service_Token_Id, Service_Id, Description, Created, Expires) VALUES
(0x11EDB4370D492701ACE62CF05D559498, 0x11EDB436EEA9FAFCACE62CF05D559498, 'Initial Token', CURRENT_TIMESTAMP, '2024-01-01');